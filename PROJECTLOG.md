Project Log
===========

To help me remember how and why I did certain things.

Things To Do
------------
- [x] write Readme
- [x] start npm package
- [x] add typescript
- [x] configure auto-styling
- [x] configure linter
- [x] start GitHub project
- [x] configure pipeline on GitHub
- [x] write class that can interpret the string "123.5(23)"
- [x] write tests for the class 
- [x] write simple webpage for test-driving the module
- [x] configure dependabot
- [x] publish test-page as GitHub-pages-page
- [x] publish as npm package
- [x] write GitHub action that publishes npm package
- [x] Split Readme by moving Things To Do, etc, to PROJECT_LOG.md  
- [x] Move TTD to GitHub issues (GITHUB ALL THE WAY)
- [x] Add badge to GitHub repo
- [x] measure code-coverage
- [x] Write utility that "hides" floating point errors (only used in test-UI)
- [x] Use less harsh colors in the UI
- [ ] write `npm run fullverify` and call it in the GitHub workflow. This is
      best-practice: https://stackoverflow.com/a/59988803
- [ ] write `bump-and-publish.sh` that bumps + tags + releases (GitHub CLI!)
- [ ] fix: package is still empty!
- [ ] fix: nyc should be dev-dependency


Ideas for the future
--------------------
- Enable passing multiple uncertainties, as in: "The length of this stick is
  1.235(17)(22) meters" for cases where systematic and statistical errors are
  stated seperately.
- let the user specify the decimal-point-handling in the uncertainty-part of 
  the uncertainty-string: 23.2(2.3) versus 23.2(23)


Setup Log
---------
- used .gitignore from online-generator for "node".
- initialized npm project: npm init, uses mostly defaults
- installed typescript: npm install typescript --save-dev
- initialized typescript project: npx tsc --init
- edited tsconfig.json to make "dist/" the compiler-output directory and
  "src/" the input directory
- test-compiled using "npx tsc" in project root
- in Terminal -> Configure Default Build Task, entered "npx tsc" so that I can
  now to ctrl+shift+b anywhere to build the project.
- update package.json with appropriate scripts for "npm run build" and 
  "npm run test"
- added "mocha/chai" as unit-test framework (works natively with typescript)
  - npm install chai mocha  @types/mocha @types/node @types/chai
  - npm install ts-node --save-dev
- set up VSCode debug according to d4719b8a0a40
  - now can use F5 in any .test file to run unit-tests and debug into 
    breakpoints in .ts-files.
- set up prettier for formatting: 
  npm install --save-dev prettier eslint-config-prettier
  - installed prettier-plugin as well, configured it as default after 
    ctrl+shift+f found multiple formatters
  - added .prettierrc.js for basic configuration
    - CAREFUL: The vscode-prettier-extensions caches this file and reloads it 
      when you do a nonconsequential change in the prettier plugin's settings
- set up ESLint for linting -- check:
  robertcooper.me/post/using-eslint-and-prettier-in-a-typescript-project
  - above link is slightly outdated: Do not run prettier inside eslint anymore!
    below notes are updated snippets, by me.
  - npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  - added to WORKSPACE settings.json, so that ESLint runs on save: 
    "editor.codeActionsOnSave": {"source.fixAll.eslint": true}
  - added to WORKSPACE settings.json so that default-formatter and edit-on-save
    is active for json, js, ts (see settings.json)
- set up clean-up of dist/-folder according to
  https://github.com/Coremail/mini-css-extract-plugin/commit/d074fd274798e48ce731e75080fdb9c60b601673
- installed webpack for bundling the code into something that a browser can 
  consume.
  - npm install --save-dev webpack webpack-cli ts-loader 
  - node_modules now using ~140MB on disk. Sigh.
- Added GitHub action that publishes the current version to GitHub whenever
  there is a new GitHub release.


Implementation Log
------------------
- Parsing an uncertainty string like "0.1234(55)" is easy, but writing it is 
  hard. It took me two attempts in as many evenings. The fact that this is so
  cumbersome is the main reason that I am publishing this as an npm module
- configured WebPack to output UncertaintyString only for now, because that
  is the first demo I am doing.
- configured GitHub actions so that the example/demo is automatically uploaded
  to a site that I can share with friends.
- since example is in 90%+ of cases going to be opened on mobile, I used simple
  media-query to make it mobile-friendly. The dev-tools in Firefox really 
  helped previewing the result. Kudos to Mozilla!


How To Do Things
----------------
- How to update the dependencies:
  - `npm outdated` to view
  - `npm update` to upgrade (minor/patch only!)
  - `npm install dep@latest` to upgrade to new major version
  - alternative: `npx check-updates -u && npm install` to do it in one go.
- How to create a new release:
  - bump the version
  - do a PR, merge it
  - do a release on GitHub, tag it `v0.5.5` or so
  - a GitHub action will do the rest