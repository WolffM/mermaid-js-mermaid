## Steps to reproduce

1. Install dependencies with `CYPRESS_INSTALL_BINARY=0 pnpm install --no-frozen-lockfile` from the repository root.
2. Add an ER parser test that uses grouped entities with namespace-style blocks, including a nested namespace for subcollections.
3. Run `pnpm vitest run packages/mermaid/src/diagrams/er/parser/erDiagram.spec.js`.
4. Inspect the failing output for the new grouping-focused test cases.

## Observed

The parser does not support grouping statements for ER diagrams. A namespace-like line is treated as a regular entity declaration, so grouped entities are not created and entity lookups return undefined in the test. Nested grouping fails with a parse error at `{`, because the grammar expects attribute block tokens instead of a grouping block. The test run exits with failures and shows the parsing trace.

## Expected

ER diagrams should support grouping entities by category and nested subcategory (for example, collections and subcollections). Group containers should be represented as layout groups, and entities declared inside a group should be assigned to that parent group. Nested groups should parse and produce parent-child group relationships so the rendered diagram can visually cluster related entities.
