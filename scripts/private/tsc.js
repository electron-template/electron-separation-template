const ChildProcess = require('child_process');
const Chalk = require('chalk');
const Path = require('path');
module.exports = compile;

function compile (directory) {
  process.stdout.write(Chalk.yellowBright(`[tsc] 编译路径:`) + directory+'\n');
  return new Promise((resolve, reject) => {
    const tscProcess = ChildProcess.exec('tsc', {
      cwd: directory,
    });

    tscProcess.stdout.on('data', data =>
      process.stdout.write(Chalk.yellowBright(`[tsc] `) + Chalk.white(data.toString()))
    );

    tscProcess.on('exit', exitCode => {
      if (exitCode > 0) {
        reject(exitCode);
      } else {
        resolve();
      }
    });
  });
}
