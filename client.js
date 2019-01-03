import ws from 'ws';
import { Terminal } from 'xterm';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';


// document.addEventListener("DOMContentLoaded", () => {
Terminal.applyAddon(attach);
// Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);

const socket = new WebSocket('ws://localhost:3000');
const terminal = new Terminal();
terminal.open(document.getElementById('terminal'));
terminal.toggleFullScreen(true);
// terminal.fit();
// window.scrollTo(0,document.querySelector("#terminal").scrollHeight);


socket.onmessage = function (event) {
  event.data.toString('utf-8').split('\n').forEach(line => {
    if (line.startsWith("%output")) {
      line = line.replace(/%output %\d+ /, '');
      line = line.replace(/\\(\d+)/g, (_, match) => String.fromCharCode(parseInt(match, 8)));
      terminal.write(line);
    }
  });
};

terminal.on('key', (key, event) => {
  if (key === 'Backspace') {
    key = 'BSpace';
  }

  if (key === ' ') {
    key = 'Space';
  }

  if (key === '"') {
    key = '\"'
  }

  if (key === 'Control' || key === 'Shift' || key === 'Meta') {
    return;
  }

  if (key.startsWith('Arrow')) {
    key = key.replace('Arrow', '');
  }

  if (event.ctrlKey) {
    key = `C-${key}`;
  }

  socket.send(key);
});

// });
