/* eslint-disable @typescript-eslint/no-var-requires */
const { perform, exit_with_error, log } = require('./_common_lib.js');

log('Making sure that we are on the main branch');
const branch_name = perform('git branch --show-current').trim();
if (branch_name != 'main') {
  exit_with_error('Must be on the main branch to do a release!');
}

log('Making sure the repo is clean (everything committed)');
const git_status = perform('git status --porcelain');
if (git_status.length != 0) {
  exit_with_error("repo is not clean! run 'git status' to learn more");
}

log('Making sure we are up-to-date with origin');
perform('git fetch');
perform('git merge --ff-only');

log('Doing the release (interactively).');
perform('gh release create', true);
