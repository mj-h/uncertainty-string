/**
 * do-pr.js
 *
 * A script that runs typical pre-pr checks and interactively (!) opens a pr.
 *
 * On a high level, the script:
 * - ensures repo is on feature branch
 * - ensures repo be clean
 * - ennsures "npm run prepr" finishes without errors. It checks
 *   - problems through ESLint
 *   - style through prettier
 *   - build-success through tsc
 *   - unit-test-success through mocha
 *   - bundling-success through webpack
 * - ensures repo is _still_ clean after webpack (-> no changes to bundle!)
 * - interactively opens PR through gh cli.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { perform, exit_with_error, log } = require('./_common_lib.js');

prCreate();

function prCreate() {
  log('Making sure that we are _not_ on the main branch');
  const branch_name = perform('git branch --show-current').trim();
  if (branch_name == 'main') {
    exit_with_error("You are on the main branch - can't do a PR from here!");
  }

  log('Making sure the repo is clean (everything committed)');
  const git_status = perform('git status --porcelain');
  if (git_status.length != 0) {
    exit_with_error("repo is not clean! run 'git status' to learn more");
  }

  log('Doing the pre-pr checks. This takes a while.');
  perform('npm run prepr', true);

  log('Checking again that the repo is clean (no new webpack output!');
  const git_status2 = perform('git status --porcelain');
  if (git_status2.length != 0) {
    exit_with_error("repo is not clean! run 'git status' to learn more");
  }

  // open the PR interactively
  perform('gh pr create', true);
}

exports.prCreate = prCreate;
