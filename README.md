<div align="center" style="text-align: center;">

# TS Library Template
This is a template for creating a TypeScript library.  
It was created on the basis of [the UserUtils library.](https://github.com/Sv443-Network/UserUtils)

</div>

## Stack
- [TypeScript](https://www.typescriptlang.org/) with [tslib](https://npmjs.com/package/tslib) import helper
- Building with [tsup](https://github.com/egoist/tsup) and [esbuild](https://github.com/evanw/esbuild)
- CI via [GitHub Actions](https://github.com/features/actions)
- Linting with [ESLint](https://eslint.org/)
- Testing with [Vitest](https://vitest.dev/)
- Coverage by [v8](https://v8.dev/)
- [pnpm](https://pnpm.io/) package manager
- [Changesets](https://github.com/changesets/changesets) for versioning and changelogs

## Getting Started
1. [Create a repo based on this template]()
2. Go to settings > secrets and add `NPM_TOKEN` with a token that has access to publish packages
3. Make sure to sign in with GitHub on https://jsr.io/, so that the workflow has rights to publish
4. Clone the new repo
5. Install dependencies with `pnpm i`
6. Search for `editme-` (case insensitive) to find all places that need to be edited
7. Create files inside `lib/` and re-export them in `lib/index.ts`
8. Run `pnpm build-all` to build the full library including types

## Tasks
- **Building:**  
  The library is built with tsup. It is only intended for code bundles though and the types it generates aren't suitable for production.  
  So instead, when using `pnpm build-all`, the types are generated with `tsc` inside the `dist/` folder. This however trims all trailing whitespace, messing up TSDoc comment formatting. So the tool at `tools/fix-dts.mts` is called to fix that.
- **Publishing on npm:**  
  Publishing on npm happens automatically when the pull request created by the changesets action is merged.  
  First, the publish to JSR should be tested though by running `pnpm check-jsr`
- **Publishing on JSR:**  
  After running `pnpm check-jsr`, merging the changesets pull request and with the publish to npm finished, the `build-and-publish-jsr.yml` workflow can be manually triggered through the "Actions" tab in the GitHub repo.  
  This will also trigger the tool at `tools/update-jsr-version.mts`, which will copy the version number from `package.json` over to `jsr.json`, so you don't have to worry about keeping them in sync manually.  
  Unfortunately triggering the publish to JSR automatically didn't work due to technical constraints.
- **Testing:**  
  The tests are run automatically on every push and pull request.  
  You can run the tests locally with `pnpm test`.  
  Run `pnpm test-coverage` to generate a coverage report at `coverage/lcov-report/index.html`.
- **Linting:**  
  Linting is also run automatically on every push and pull request.  
  You can run the linter locally with `pnpm lint`.  
  Make ESLint fix all auto-fixable issues with `pnpm format`.
