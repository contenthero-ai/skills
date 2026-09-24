/**
 * Builds the plugin's derived files and packages, and guards everything it derives.
 *
 *   node scripts/build-skill.mjs          write every derived file
 *   node scripts/build-skill.mjs --check  fail if anything derived has drifted (CI)
 *   node scripts/build-skill.mjs --zip    write, then package dist/contenthero.zip and dist/contenthero-plugin.zip
 *
 * ONE PLUGIN, ONE SKILL, TWO HAND-EDITED MANIFESTS. This repo is an Agent Plugins 1.0 package
 * (agent-plugins.org): `plugin.json` and `mcp.json` at the root, the skill at `skills/contenthero/`.
 * Cursor, VS Code, Codex, Devin, OpenClaw and Hermes load that layout as-is. Claude reads its own
 * spellings (`.claude-plugin/`, `.mcp.json` with `type: "http"`), and ChatGPT reads
 * `agents/openai.yaml` inside the skill. Every one of those is GENERATED here from the two root
 * files, because each vendor copy written by hand is one more place a version, URL or description
 * drifts. That already happened: the old per-vendor manifests pointed each host at a different,
 * wrong skill path (measured against each vendor's docs 2026-09-24).
 *
 * WHY TWO ZIPS. Chat apps install by UPLOAD. A bare skill upload (claude.ai Skills, ChatGPT, Gemini)
 * takes `contenthero.zip`, whose root is the skill folder. A plugin upload (claude.ai Plugins) takes
 * `contenthero-plugin.zip`, whose root is the plugin, and brings the ContentHero connector with it:
 * a bare skill has no way to declare one. Both are DERIVED on every release, never hand-built.
 *
 * WHY THE VERSION CHECK. The version is hand-spelled in three places (VERSION, package.json,
 * plugin.json) and derived into the rest. A release whose files disagree describes itself two ways.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const read = (p) => readFileSync(join(root, p), 'utf8')
const json = (p) => JSON.parse(read(p))
const mode = process.argv[2] ?? '--write'
const failures = []

const SKILL = 'skills/contenthero'
const plugin = json('plugin.json')
const mcp = json('mcp.json')

// ─── the canonical files conform to Agent Plugins 1.0 ────────────────────────
// The spec's schemas are CLOSED: an unknown top-level key is reported and ignored, a wrong type
// rejects the whole plugin. Checked locally because a conformant client must never fetch a schema
// while loading, and neither should CI.
{
  const allowed = ['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions']
  for (const k of Object.keys(plugin)) if (!allowed.includes(k)) failures.push(`plugin.json has "${k}", which Agent Plugins 1.0 does not allow at the top level`)
  if (plugin.$schema !== 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json') failures.push('plugin.json $schema is not the Agent Plugins 1.0.0 identifier')
  if (!/^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(plugin.name ?? '')) failures.push(`plugin.json name "${plugin.name}" breaks the Agent Plugins name rule`)
  for (const k of Object.keys(plugin.author ?? {})) if (!['name', 'email', 'url'].includes(k)) failures.push(`plugin.json author.${k} is not allowed`)

  if (mcp.$schema !== 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json') failures.push('mcp.json $schema is not the Agent Plugins 1.0.0 identifier')
  for (const k of Object.keys(mcp)) if (!['$schema', 'mcpServers'].includes(k)) failures.push(`mcp.json has "${k}", which Agent Plugins 1.0 does not allow`)
  for (const [id, s] of Object.entries(mcp.mcpServers ?? {})) {
    if (s.type !== 'streamable-http' || !s.url) failures.push(`mcp.json server "${id}" must be { "type": "streamable-http", "url" }`)
    for (const k of Object.keys(s)) if (!['type', 'url', 'headers'].includes(k)) failures.push(`mcp.json server "${id}" has "${k}", which the schema does not allow`)
  }
}
// ONE SERVER, AND ITS KEY IS THE NAME MEMBERS SEE. A plugin's connector has no display-name field:
// claude.ai shows the key itself (Anthropic's own rows read "Slack" only because its Connectors
// Directory supplies the name). Hence "ContentHero", not the lowercase key convention.
const serverEntries = Object.entries(mcp.mcpServers ?? {})
if (serverEntries.length !== 1) failures.push(`mcp.json must declare exactly one server, found ${serverEntries.length}`)
const [serverKey, server] = serverEntries[0] ?? []

// ─── the derived files ───────────────────────────────────────────────────────
const iface = plugin.extensions?.['com.openai']?.interface ?? {}
const q = (s) => JSON.stringify(s) // a JSON string is a valid YAML double-quoted scalar
const pretty = (o) => JSON.stringify(o, null, 2) + '\n'
const meta = {
  name: plugin.name,
  version: plugin.version,
  description: plugin.description,
  author: plugin.author,
  homepage: plugin.homepage,
  repository: plugin.repository,
  license: plugin.license,
  keywords: plugin.keywords,
}

const derived = {
  // Claude Code and claude.ai read `.mcp.json`, and spell the transport "http".
  '.mcp.json': pretty({ mcpServers: { [serverKey]: { type: 'http', url: server?.url } } }),

  // `name` must stay lowercase (Agent Plugins forbids capitals, and it is the `/contenthero` handle),
  // so Claude would title-case it to "Contenthero". `displayName` carries the real casing.
  '.claude-plugin/plugin.json': pretty({ name: meta.name, displayName: iface.displayName, ...meta }),

  // NO `skills` FIELD, ON PURPOSE. Claude scans `skills/` by default. The old entry listed skills as
  // objects where Claude's schema takes paths, so the one thing it declared was the thing it broke.
  '.claude-plugin/marketplace.json': pretty({
    name: plugin.name,
    description: plugin.description,
    owner: plugin.author,
    plugins: [{ name: plugin.name, displayName: iface.displayName, source: './', description: plugin.description, version: plugin.version }],
  }),

  [`${SKILL}/agents/openai.yaml`]: `# GENERATED by scripts/build-skill.mjs from plugin.json and mcp.json. Do not edit.
interface:
  display_name: ${q(iface.displayName)}
  short_description: ${q(iface.shortDescription)}
  icon_small: "./assets/icon.svg"
  icon_large: "./assets/icon.svg"
  brand_color: ${q(iface.brandColor)}
  default_prompt: ${q(iface.defaultPrompt?.[0])}

dependencies:
  tools:
    - type: "mcp"
      value: ${q(serverKey)}
      description: "ContentHero hosted MCP server (OAuth, runs against your account and credits)"
      transport: "streamable_http"
      url: ${q(server?.url)}
`,
}

if (!existsSync(join(root, `${SKILL}/assets/icon.svg`))) failures.push(`${SKILL}/assets/icon.svg is missing`)

for (const [path, content] of Object.entries(derived)) {
  if (mode === '--check') {
    const committed = existsSync(join(root, path)) ? read(path) : ''
    if (committed !== content) failures.push(`${path} is stale: run \`npm run build:skill\` and commit the result`)
  } else {
    mkdirSync(join(root, dirname(path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }
}

// ─── the skill ───────────────────────────────────────────────────────────────
{
  const lines = read(`${SKILL}/SKILL.md`).split('\n')
  // The spec requires the frontmatter name to equal the folder name.
  const name = lines.find((l) => l.startsWith('name:'))?.replace(/^name:\s*/, '').trim()
  if (name !== SKILL.split('/').pop()) failures.push(`SKILL.md name "${name}" must equal its folder name`)

  // Claude Code names a plugin's connector tools `mcp__plugin_<plugin>_<server>__*`. If allowed-tools
  // does not carry that exact pattern, every ContentHero call stops for a permission prompt, and a
  // renamed key or plugin would break it silently.
  const pattern = `mcp__plugin_${plugin.name}_${serverKey}__*`
  const tools = lines.find((l) => l.startsWith('allowed-tools:')) ?? ''
  if (!tools.includes(pattern)) failures.push(`SKILL.md allowed-tools must include ${pattern}`)

  // YAML folds a wrapped `>-` description into one line, and claude.ai does. ChatGPT does NOT: it
  // rendered every wrap as a hard line break (measured 2026-09-24, v0.2.1 test upload). A block
  // scalar holding a single line is the form proven on claude.ai, ChatGPT and Gemini.
  const at = lines.findIndex((l) => l.startsWith('description:'))
  if (at < 0) failures.push('SKILL.md has no description')
  else {
    const inline = lines[at].replace(/^description:\s*/, '')
    const valueLines = /^[>|]/.test(inline) ? lines.slice(at + 1).findIndex((l) => !/^\s+\S/.test(l)) : 1
    if (valueLines !== 1) failures.push(`SKILL.md description spans ${valueLines} lines; ChatGPT shows each wrap as a line break. Keep it on one line.`)
  }
}

// ─── one version, three hand spellings ───────────────────────────────────────
const version = read('VERSION').trim()
for (const [file, v] of Object.entries({ 'package.json': json('package.json').version, 'plugin.json': plugin.version })) {
  if (v !== version) failures.push(`${file} says ${v}, VERSION says ${version}`)
}

if (failures.length) {
  console.error(`build-skill: ${failures.length} problem(s)\n  - ${failures.join('\n  - ')}`)
  process.exit(1)
}

// ─── the packages ────────────────────────────────────────────────────────────
if (mode === '--zip') {
  rmSync(join(root, 'dist'), { recursive: true, force: true })
  mkdirSync(join(root, 'dist'))
  const zip = (out, cwd, entries) =>
    execFileSync('zip', ['-r', '-X', '-q', join(root, 'dist', out), ...entries, '-x', '*.DS_Store'], { cwd, stdio: 'inherit' })
  // The skill folder, not its contents, is this zip's root: claude.ai and ChatGPT require it.
  zip('contenthero.zip', join(root, 'skills'), ['contenthero'])
  // The plugin root is this zip's root, exactly as the repo is laid out.
  zip('contenthero-plugin.zip', root, ['plugin.json', 'mcp.json', '.mcp.json', '.claude-plugin', 'skills', 'README.md', 'LICENSE'])
  console.log(`build-skill: wrote dist/contenthero.zip and dist/contenthero-plugin.zip (v${version})`)
} else {
  console.log(`build-skill: ${mode === '--check' ? 'derived files are current' : 'wrote derived files'} (v${version})`)
}
