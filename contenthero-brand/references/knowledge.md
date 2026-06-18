# The brand knowledge base

The knowledge base is everything the user has uploaded about their brand: notes, decisions, lessons, documents, articles, video transcripts. It is stored with embeddings, so it is semantically searchable. It is the deepest grounding ContentHero has, and it grows as the user works. Five operations, all scoped to one brand kit.

## The three reads, and when to use each

- **`search_brand_knowledge`** (the workhorse): semantic retrieval. Give it a natural-language query, get back the most relevant passages, ranked by similarity. Use it whenever you need what the brand has said or decided about a topic, before drafting or deciding. This is the read to reach for first.
  - MCP: `search_brand_knowledge({ brandKitId, query, limit?, threshold? })`
  - CLI: `contenthero brand-kit knowledge search <brandKitId> "<query>"`
- **`list_brand_knowledge`**: the complete, paginated index (titles and metadata, no bodies). Use it to browse what exists, show the user their library, or find an item's id. Not for relevance; that is search.
  - CLI: `contenthero brand-kit knowledge list <brandKitId>`
- **`get_brand_knowledge`**: one item's stored body by id. The stored body is a capped anchor; the full document lives in the embedded chunks that `search` returns. Use `get` to read a specific known item; use `search` for depth.
  - CLI: `contenthero brand-kit knowledge get <brandKitId> <knowledgeId>`

Browse (list) to see what exists, retrieve (search) to find what is relevant, read (get) to open one item.

## Growing the knowledge base (the real value)

The knowledge base is most valuable when it grows as the user works. When the user learns something, decides something, defines an asset, or shares a resource, offer to remember it. This is what makes future grounding richer.

`add_brand_knowledge` (CLI `contenthero brand-kit knowledge add <brandKitId> ...`), requires `brandkit:write`. Source types:
- **text:** a note. `--text "..."` (MCP `sourceType: "text", text`). For lessons, decisions, definitions, catchphrases.
- **url:** scrape and add a web page. `--url <link>`.
- **youtube:** add a video's transcript. `--youtube <link>`.
- **file:** a document, image, or media file. For a small document or image, CLI `--file <path>` reads and base64-encodes it locally (MCP `fileData`). For a large file, or a video or audio file, pass a hosted URL the server fetches: CLI `--file-url <url>` (MCP `fileUrl`); video and audio are chunked and embedded automatically.

Confirm before adding, give it a clear title, and tell the user it is now searchable. Good moments to offer: after a brand decision, when the user shares an article or doc, when a generation or post taught a lesson worth keeping.

## Remove

`remove_brand_knowledge` (CLI `contenthero brand-kit knowledge remove <brandKitId> <knowledgeId>`) deletes an item and its embedding chunks. On user request only.

## How this feeds the other skills

- `contenthero-pipeline`'s Draft phase: search the knowledge base for the brand's stance, prior copy, and decisions on the topic, and fold that into the grounded draft.
- `contenthero-generate`: search for visual or product details the brand has documented before generating.

When grounding any on-brand decision, a knowledge search is often the single highest-leverage read. Do not skip it because the brand kit fields looked sufficient; the knowledge base holds what the structured fields do not.
