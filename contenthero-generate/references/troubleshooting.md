# Troubleshooting

## CLI exit codes

| Code | Meaning | Action |
|---|---|---|
| 0 | Success | - |
| 1 | General error (API or network), or a generation came back `failed` | Read the error; for a failed render, adjust the request and re-run (do not retry the identical prompt blindly) |
| 2 | Usage error (bad flag, invalid value) | Fix the arguments; check `contenthero <command> --help` |
| 3 | Authentication error | The key is missing, revoked, or unauthenticated. Re-run `contenthero login` or check the MCP OAuth connection |
| 4 | Timeout: accepted but not finished in time | The `outputId` is still emitted. Keep polling with `contenthero generation wait <id>` or `generation status <id>` |

MCP equivalents: a pending result (still rendering) carries the `outputId` to poll; an error result carries the message.

## "Still rendering" is not a failure

`generate_*` and `upscale` smart-wait about 50s, then return an `outputId` if the render is still going. Video and boards routinely take minutes. Poll the id; never re-submit because it is slow (that spends again). Audio is synchronous and returns directly.

## Safe retries (idempotency)

If you genuinely need to retry a submission (e.g. a network blip on submit) without risking a double charge, reuse the same client-chosen `outputId` as an idempotency key: re-submitting with the same id returns the existing job instead of starting another. You also know the id up front and can poll immediately. The id must be a UUID.

## 400 / invalid parameter

The most common cause is sending a field a model does not support, or a value outside its allowed set:

- A `resolution` or `aspectRatio` the model does not allow.
- A `mode` on a model that has none (only flux-2-pro and flux-1-kontext take `mode`).
- `shots` on a model other than Kling 3.0, or `multiShot` outside WAN.
- A `quality` field the model does not accept.

Check `list_models` and `model-catalog.md` for what the chosen model supports, then resend only supported fields.

## Scope errors

Generation requires a key with generate scopes. If a call fails on scope, tell the user which scope to grant in API Keys settings. Do not try to route around it.

## Low balance

A spend that fails for insufficient credits is not a bug. Check the balance first (`get_balance` / `contenthero account balance`), and if low, point the user at their billing settings. Always cost-preview (`getCost` / `--cost`) before a large or batched spend.

## Reference will not resolve

- An output-id from another account will not resolve (ownership-scoped). Use your own outputs.
- A URL behind auth, a login wall, or a WAF cannot be fetched. Use a public URL or a ContentHero output-id.
- Wrong media kind for the field (e.g. a video id in a start-frame slot) is rejected. Match the kind.

## Wrong subject / off-model output

For consistency across outputs, do not rely on the prompt alone. Build a reference board for the subject and reference it, or reuse an avatar look. See `identity.md` and `chaining.md`.
