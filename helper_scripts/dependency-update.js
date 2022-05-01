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
  perform('npm outdated');
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
perform('npm outdated'); // this will throw if there is an error

perform('git add .');
perform('git commit -m "update dependencies"');

prCreate();
