Uncertainty String
==================

A module for handling physics-style uncertainty-strings, like 1.873(34). 
Install with 

```sh
npm install uncertainty-string
```

Usage:

```js
const { UncertaintyString } = require("uncertainty-string")

let [value, uncertainty] = UncertaintyString.toNumbers("1.234(56)");
// -> value       = 1.234
//    uncertainty = 0.056

let uncertstr = UncertaintyString.fromNumbers(0.789, 0.015);
// -> uncertstr = 0.789(15)
```

Background
----------
In physics, it is customary to always state the measurement-uncertainty 
together with the measurement. For example: "The length of this stick is 
1.235 meters plus or minus 0.022 meters". Since this is cumbersome, the following
shorthand is often used: "The length of this stick is 1.234(22) meters".

Some debate exists over including the decimal point in the uncertainty:
- with decimal-point: 45.6(2.3)
- without decimal-point: 45.6(23)
Some journals use the decimal-point, others don't. This module follows the
convention used by Physical Review Letters and omits the decimal point (see 
page 1 of [this article](https://journals.aps.org/prl/pdf/10.1103/PhysRevLett.127.072502))



Examples
--------
For a full list of examples, see the [test file](test/UncertaintyString.test.ts).


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
- [ ] publish test-page as GitHub-pages-page (including running webpack?)
- [x] publish as npm package
- [ ] write GitHub action that publishes npm package


Ideas for the future
--------------------
- Enable passing multiple uncertainties, as in: "The length of this stick is
  1.235(17)(22) meters" for cases where systematic and statistical errors are
  stated seperately.
- let the user specify the decimal-point-handling in the uncertainty-part of 
  the uncertainty-string: 23.2(2.3) vs. 


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
