/**
 * The skill's one guard. It checks the tool surface in BOTH directions.
 *
 *   forward   every tool the skill names must exist
 *   reverse   every tool that exists must be named somewhere in the skill
 *
 * WHY BOTH, and why the reverse direction is the point.
 *
 * The forward check is the one the documentation repo already runs, and it exists because 77
 * dead names sat in the docs for three months after the post-to-card rename. This repo had
 * the same rot and worse: measured 2026-09-17, the three skills named 21 tools that no
 * longer existed and covered 25 of 88 live ones, with TWO ENTIRE DOMAINS (the editor's 16
 * tools, inspiration's 4) not mentioned anywhere. Nothing was looking, in either direction.
 *
 * The reverse check is what makes "full coverage" a fact instead of a claim. A skill can
 * assert it covers the product in its README and be wrong by 63 tools, and no test, build
 * or typecheck would ever say so.
 *
 * WHAT COVERAGE MEANS HERE, and what it deliberately does NOT mean.
 *
 * It does NOT mean every tool gets a parameter table. The skill must never enumerate the
 * tool surface: when it runs, the agent has ALREADY received every name, description and
 * full JSON Schema from listTools(). Restating them would be a second source of truth for
 * facts the agent already holds, bought with tokens, and guaranteed to drift. That is
 * precisely the failure that rotted the documentation.
 *
 * It means every tool is REACHABLE THROUGH A DOCUMENTED WORKFLOW: named at least once in a
 * sentence that tells an agent when to reach for it and what it sits next to. Sequencing,
 * traps, gates and choice are what listTools() cannot supply, and they are the whole job.
 *
 * Because coverage is derived by reading the prose rather than from a hand-maintained list,
 * there is no second list to fall behind. You cannot satisfy this guard without writing the
 * sentence.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
// ⚠️ THE PACKAGE ENTRYPOINT, NEVER `dist/<file>.js`. Those deep paths existed through 0.4.8 and are
// gone from later builds, which bundle to one file, so the guard could not load any current mcp.
import { buildServer, TOOL_GROUPS } from '@contenthero/mcp'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'

const REPO = dirname(import.meta.dirname)

/**
 * Names that look like tools but are not operations. Keep this short and justify every
 * entry, or it becomes the place dead names go to hide.
 */
const NOT_A_TOOL = new Set([
  'ch_live_', // an API key prefix
  'active_brand_kit_id', // fields in the .contenthero/context.md cache schema
  'active_brand_kit_name',
  'default_avatar_id',
  'default_look_id',
  'connected_account_ids',
  'recent_card_ids',
])

/** Files whose entries are historical records, exempt as FILES rather than by name. */
const HISTORICAL = ['CHANGELOG.md']

function markdownFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || entry === 'node_modules' || entry === 'scripts') continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...markdownFiles(full))
    else if (entry.endsWith('.md')) out.push(full)
  }
  return out
}

/* ----------------------------------------------------------- the live surface */

const server = await buildServer({ getClient: () => ({}) })
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
const mcp = new Client({ name: 'skill-coverage-check', version: '0' })
await Promise.all([server.connect(serverTransport), mcp.connect(clientTransport)])
const { tools } = await mcp.listTools()
const liveTools = new Set(tools.map((t) => t.name))

/**
 * Tool names are not the only snake_case vocabulary the surface advertises.
 *
 * `update_canvas` documents its OPS (`create_layer`, `reorder_layer`, `set_background` and a
 * dozen more) and the generate tools advertise enum values like `numbered_tag`. Those are real,
 * current, and worth writing about, but they are not tools, so checking them against the tool
 * list alone reported SEVEN correct lines as dead names.
 *
 * Rather than allowlisting them (an allowlist is where dead names go to hide), accept any token
 * the LIVE SURFACE ITSELF still mentions, by scraping every description and enum the server
 * advertises. That keeps the guard honest in the direction that matters: an op or an enum value
 * that gets retired disappears from the descriptions too, and is caught the same day.
 */
const liveVocabulary = new Set(liveTools)
const harvest = (value) => {
  if (typeof value === 'string') {
    for (const m of value.matchAll(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g)) liveVocabulary.add(m[0])
  } else if (Array.isArray(value)) {
    for (const v of value) harvest(v)
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) harvest(v)
  }
}
harvest(tools)

/* --------------------------------------------------------------- what we name */

/**
 * The two directions need two different extractions, and conflating them was a real bug.
 *
 * DEAD NAMES are found by pattern, because we cannot enumerate what does not exist. Any
 * backticked snake_case token is a candidate: that heuristic catches a retired tool whose
 * verb no longer appears anywhere live, which a verb-derived list structurally cannot.
 *
 * COVERAGE is found by searching for each live name literally. The first version of this
 * reused the snake_case pattern for both, and therefore could not see `archive`, `favorite`,
 * `upscale` or `transcribe` at all: FOUR REAL TOOLS, documented in prose, reported as
 * uncovered because their names contain no underscore. A guard that cannot see a whole
 * naming shape reports work as missing that is already done, which is how a guard trains
 * people to ignore it.
 */
const SNAKE_CASE_RE = /`([a-z][a-z0-9]*_[a-z0-9_]+)`/g
const backticked = (name) => new RegExp('`' + name + '`')

const named = new Map() // tool name -> [file:line]
const dead = []
const corpus = []

for (const file of markdownFiles(REPO)) {
  const rel = relative(REPO, file)
  const text = readFileSync(file, 'utf8')
  corpus.push([rel, text])
  if (HISTORICAL.includes(rel)) continue

  for (const match of text.matchAll(SNAKE_CASE_RE)) {
    const name = match[1]
    if (NOT_A_TOOL.has(name) || name.endsWith('_id') || liveVocabulary.has(name)) continue
    const line = text.slice(0, match.index).split('\n').length
    dead.push(`${rel}:${line}  \`${name}\` does not exist`)
  }
}

for (const tool of liveTools) {
  const re = backticked(tool)
  for (const [rel, text] of corpus) {
    if (!re.test(text)) continue
    const line = text.slice(0, text.search(re)).split('\n').length
    if (!named.has(tool)) named.set(tool, [])
    named.get(tool).push(`${rel}:${line}`)
  }
}

/* --------------------------------------------------------------- the verdict */

const uncovered = [...liveTools].filter((n) => !named.has(n))
let failed = false

if (dead.length) {
  failed = true
  console.error(`\nThe skill names ${dead.length} tool(s) that do not exist:\n`)
  for (const d of dead) console.error('  ' + d)
  console.error('\nEither the name changed, or the skill describes a surface we removed.')
}

if (uncovered.length) {
  failed = true
  console.error(`\n${uncovered.length} of ${liveTools.size} live tools are not reachable through any documented workflow:\n`)
  // Report by domain, because a whole silent domain is a different problem from a stray
  // tool, and the fix is a different size. Two domains were 0% covered before this guard.
  for (const group of TOOL_GROUPS) {
    const missing = group.tools.filter((n) => uncovered.includes(n))
    if (!missing.length) continue
    const total = group.tools.length
    const flag = missing.length === total ? '   <-- NOTHING in this domain is documented' : ''
    console.error(`  ${group.title} (${total - missing.length}/${total})${flag}`)
    console.error(`    ${missing.join(', ')}`)
  }
  console.error(
    '\nName each one in the workflow where an agent would reach for it. Do NOT add a\n' +
      'parameter table: the agent already has every schema from listTools(). Write the\n' +
      'sequencing, the trap, the gate, or the choice that listTools() cannot tell it.',
  )
}

if (failed) process.exit(1)

console.log(
  `Every one of the ${liveTools.size} live tools is reachable through a documented workflow, ` +
    `and the skill names nothing that does not exist.`,
)
