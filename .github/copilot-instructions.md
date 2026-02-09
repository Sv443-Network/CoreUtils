---
applyTo: "**"
---

# Project Outline:

This is a core library for JS/TS projects, for Node, Deno and the browser. It contains many different utility functions, classes and types.
It is built with tsup, released with GitHub Actions and Changesets, tested with vitest, has v8/istanbul coverage and is linted with ESLint.

# Instructions:

- Write code that is a tad on the denser side, but still readable and self-explanatory. Avoid excessive verbosity.
- Use modern (<=ES2024) features where appropriate, but avoid features that aren't in the browser baseline yet.
- Depending on the type of change (major, minor, patch), a changeset file needs to be created.
- Don't add comments for the sake of comments. Code should be self-explanatory and comments reserved for explaining the WHY.
- Don't give up on a problem and suggest adding a `// TODO: fix` comment. Realize dead ends and think about solutions or alternatives.
- Respect the existing code style and the linter rules at `eslint.config.mjs` and `tsconfig.json`.
- Write JSDoc comments for all public classes, methods and functions, including parameter and return types and descriptions.
- Always add a return type to functions, even if it could be inferred.
- Also write unit tests for all new and changed functions, aiming for high code coverage, but not excessively so.
- When adding or editing a feature, documentation needs to be added or adjusted in `docs.md`. Follow the existing style and structure.
- Never use `@ts-ignore` - always use `@ts-expect-error`, but only if absolutely necessary.
- Always use `.ts` extension for local imports.
