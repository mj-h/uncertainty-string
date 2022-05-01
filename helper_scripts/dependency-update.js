/* eslint-disable @typescript-eslint/no-var-requires */
const { perform, exit_with_error, log } = require('./_common_lib.js');
const { prCreate } = require('./pr-create');

log('Making sure that we are on the main branch');
const branch_name = perform('git branch --show-current').trim();
if (branch_name != 'main') {
  exit_with_error('Must be on the main branch to do a dependency update!');
}

log('Making sure the repo is clean (everything committed)');
const git_status = perform('git status --porcelain');
if (git_status.length != 0) {
  exit_with_error("repo is not clean! run 'git status' to learn more");
}

let isUpToDate = true;
try {
  perform('npm outdated', false, true);
} catch (error) {
  isUpToDate = false;
}

if (isUpToDate) {
  log('Everything up to date. No update needed. Exiting.');
  process.exit(0);
}

log('Creating branch for update');
const dateStr = new Date().toISOString().slice(0, 10);
perform('git checkout -b upgrade-deps-' + dateStr);

log('Updating dependencies');
perform('npm update');

log('Checking if packages are still outdated (another major version maybe?');
try {
  perform('npm outdated', false, true); // this will throw if there is an error
} catch (error) {
  exit_with_error(`
  This is an awkward state -- sorry.

  The dependencies are updated, but only the "minor" and "patch" version. Any
  "major" versions are not yet updated, but they should be. This happens 
  seldom enough that I did not yet automate the process -- you hae to do it
  manually.

  Check the output of "npm outdated". Upgrade any major versions with something
  like "npm install <dependency>@latest". Commit all changes, and the raise
  a pr using the "pr-create.js" helper script.
  `);
}

perform('git add .');
perform('git commit -m "update dependencies"');
try {
  prCreate();
} catch (error) {
  exit_with_error('Failed in pr-create -- fix the errors and run pr-create.js.');
}
