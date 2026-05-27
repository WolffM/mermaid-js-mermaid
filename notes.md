## Steps to reproduce

1. Install dependencies with `CYPRESS_INSTALL_BINARY=0 pnpm install --no-frozen-lockfile`.
2. Add a focused repro test in `packages/mermaid/src/diagrams/flowchart/parser/flow-md-string.spec.js` that parses labels and subgraph titles written as escaped backtick markdown inside quotes, for example `"\`Long **subgraph** title\`"`.
3. Run `pnpm vitest run packages/mermaid/src/diagrams/flowchart/parser/flow-md-string.spec.js`.
4. Observe the test assertion output for node text, edge text, and subgraph title label type.

## Observed

The new repro test failed before the code fix. The parser treated escaped-backtick labels as plain strings and preserved visible tick characters, returning values like `\`The cat in **the** hat\``instead of markdown content without delimiters. In the failure trace,`labelType` was not interpreted as markdown for escaped-delimiter usage, which matches the reported behavior where backticks appear in rendered labels in some environments.

## Expected

Escaped backtick delimiters used in quoted flowchart labels should be interpreted the same way as normal backtick markdown delimiters. Node labels, edge labels, and subgraph titles should parse as markdown label type, remove the delimiter characters, and produce clean text content for rendering. This avoids visible tick marks and keeps backtick-based wrapping usage consistent across embedding environments.
