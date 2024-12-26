import { join } from 'path';
import { spawn } from 'child_process';
import { EOL } from 'os';
import Chalk from 'chalk';
import { app } from 'electron';

function sendMessageToRenderer(mainWindow, msg) {
  mainWindow?.webContents.send('send-for-main-propress', msg);
}

function createServerHandle(serverPath, mainWindow, ...args) {
  const [command, arg = [], cwd] = args;
  sendMessageToRenderer(mainWindow, `正在启动服务...,路径为${serverPath}`);
  const child = spawn(command, arg, {
    stdio: ['ignore', 'pipe', 'pipe'], // 忽略输入，将标准输出和标准错误重定向到管道
    shell: true, // 在 Windows 上可能需要设置为 true
    cwd,
  });

  function stop() {
    if (child) {
      child.removeAllListeners('exit');
      child.kill();
    }
  }

  // 监听子进程的标准输出
  child.stdout.on('data', (data) => {
    if (data == EOL) {
      return;
    }
    sendMessageToRenderer(mainWindow, data.toString());
    process.stdout.write(Chalk.blueBright(`[nest] `) + Chalk.white(data.toString()));
  });

  // 监听子进程的标准错误
  child.stderr?.on('data', (data) => {
    sendMessageToRenderer(mainWindow, data.toString());
    process.stderr.write(Chalk.blueBright(`[nest] `) + Chalk.white(data.toString()));
  });

  // 监听子进程的关闭事件
  child.on('close', (code) => {
    sendMessageToRenderer(mainWindow, '服务已关闭');
    console.log(`child process close with code ${code}`);
    stop();
  });
  child.on('exit', (code) => {
    sendMessageToRenderer(mainWindow, '服务已退出');
    console.log(`child process exited with code ${code}`);
    stop();
  });

  return stop;
}

function createServer(mainWindow) {
  let stopHandler;
  if (process.env.NODE_ENV !== 'development') {
    const serverPath = join(app.getAppPath(), '/server', 'main.js');
    stopHandler = createServerHandle(serverPath, mainWindow, 'node ' + serverPath);
  } else {
    const serverPath = join(__dirname, '..', '..', '..', 'server');
    stopHandler = createServerHandle(serverPath, mainWindow, 'npm', ['run', 'dev'], serverPath);
  }
  return stopHandler;
}

export default createServer;