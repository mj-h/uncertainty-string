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

log('Making sure we are up-to-date with origin');
perform('git fetch');
perform('git merge --ff-only');

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

log('Checking if packages are still outdated (major versions maybe?)');
let hasMajorUpdates = false;
try {
  perform('npm outdated', false, true); // this will throw if there are outdated packages
} catch (error) {
  hasMajorUpdates = true;
  log('Major version updates detected. Updating to latest major versions...');
  
  // Use npm-check-updates to update package.json to latest versions
  // First check if ncu is available, if not install it temporarily
  try {
    perform('npx --yes npm-check-updates -u', false, true);
    log('package.json updated. Installing new versions...');
    perform('npm install');
    log('Major version updates completed.');
  } catch (ncuError) {
    exit_with_error(`
    Failed to update major versions automatically.
    
    You can try manually:
    1. Install npm-check-updates: npm install -g npm-check-updates
    2. Run: ncu -u
    3. Run: npm install
    4. Commit and create PR
    
    Or update packages individually with: npm install <package>@latest
    `);
  }
  
  // Verify everything is up to date now
  try {
    perform('npm outdated', false, true);
    log('All dependencies are now up to date!');
  } catch (verifyError) {
    log('Warning: Some packages may still be outdated. Check manually with "npm outdated"');
  }
}

perform('git add .');
const commitMsg = hasMajorUpdates 
  ? 'update dependencies (including major versions)'
  : 'update dependencies';
perform(`git commit -m "${commitMsg}"`);
try {
  prCreate();
} catch (error) {
  exit_with_error('Failed in pr-create -- fix the errors and run pr-create.js.');
}
