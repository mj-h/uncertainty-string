/**
 * Delete branches that have been merged/rebased into the main branch.
 * Caution: As a side-effect, this script rebases all branches on top of
 * the main branch!
 * This script works in _this_ repo, but is probably not a good script for
 * any other repo.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { perform, exit_with_error, log } = require('./_common_lib.js');

log('Making sure the repo is clean (everything committed)');
const git_status = perform('git status --porcelain');
if (git_status.length != 0) {
  exit_with_error("repo is not clean! run 'git status' to learn more");
}

log('Switching to main branch');
perform('git checkout main');

log('Updating main branch');
perform('git fetch');
perform('git merge --ff-only');

perform('git remote prune origin');

branches = perform("git branch --format='%(refname:short)'").split('\n');

for (let branch of branches) {
  // the format-string above needs "'" around it to work on Linux, but the "'"
  // are actually inserted into the output when run on Windows. This regex
  // removes them -- the regex does what branch.trim("'") would do, if it
  // existed.
  branch = branch.replace(/^'+|'+$/g, '');
  if (branch == 'main' || branch == '') {
    continue;
  }
  perform(`git checkout ${branch}`);
  try {
    perform('git rebase main', false, true);
  } catch (error) {
    perform('git rebase abort');
    continue;
  }
  perform('git checkout main');
  perform(`git branch -d ${branch}`);
}
