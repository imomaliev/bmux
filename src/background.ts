'use strict';

import { app, protocol, BrowserWindow } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';


import ws from 'ws';
import express from 'express';
import cors from 'cors';
import http from 'http';
import childProcess from 'child_process';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

const expressApp = express();

expressApp.use('/static', express.static('static'));
expressApp.use(cors());

expressApp.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const server = http.createServer(expressApp);
server.listen(3000);

const socketServer = new ws.Server({server});


socketServer.on('connection', (socket) => {
  const tmux = childProcess.spawn('tmux', ['-C', 'attach', '-t', 'bmux2']);

  socket.on('message', (message) => {
    console.log('received:', JSON.stringify(message));
    tmux.stdin.write(message + '\n');
  });

  socket.on('close', () => {
    tmux.kill();
  });

  tmux.stdout.on('data', (data) => {
    data = data.toString('utf8');
    console.log('tmux:', data);
    socket.send(data.toString('utf8'));
  });

  tmux.on('close', () => {
    console.log('tmux exited');
  });
});


// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });
function createWindow() {
  // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      // disable initial window from showing
      show: false,
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    // if (!process.env.IS_TEST) { win.webContents.openDevTools(); }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
  // show window without setting focus
    win.showInactive();

    win.on('closed', () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
