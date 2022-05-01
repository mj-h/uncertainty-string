/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');

/**
 * perform(cmd_str, interactive)
 *
 * Wrapper around execSync to pretty-print the command that is being performed.
 * By default, this command captures the stdout of the command, prints it, and
 * returns it.
 * Alternatively, you can specify interactive==true, so that the stdio of the
 * parent-process (typically: the terminal) is used. This is helpful for:
 * - long-running commands with output that does not need to be captured, such
 *   as `npm run build`
 * - interactive commands, such as `gh pr create`
 *
 * @param {*} cmd_str The string to be passed to cmd.exe/bash/whathaveyou
 * @param {*} interactive Boolean (default: false) to specify if the command
 *                        should be run "interactivel", i.e. with user input
 * @returns
 */
function perform(cmd_str, interactive = false) {
  try {
    console.log('==========');
    console.log('$: ' + cmd_str);
    console.log('==========');
    if (interactive) {
      execSync(cmd_str, { stdio: 'inherit' });
      return null; // can't return anything; all stdout was already printed.
    }
    const output = execSync(cmd_str).toString();
    console.log(output);
    return output;
  } catch (e) {
    console.error('===========================================');
    console.error('Command Failed: ' + cmd_str);
    console.error('===========================================');
    // no need to print e.message -- it contains stderr, which at this point
    // has already been sent to the parent process and been printed to the
    // console!
    exit_with_error('');
  }
}

function exit_with_error(msg) {
  console.error(msg);
  process.exit(1);
}

function log(msg) {
  console.log('# ' + msg);
}

exports.log = log;
exports.exit_with_error = exit_with_error;
exports.perform = perform;
