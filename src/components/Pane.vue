<template>
  <div id="terminal"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import ws from 'ws';
import { Terminal } from 'xterm';
import 'xterm/dist/xterm.css';

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

const keys = '';

socket.onmessage = function(event) {
  event.data.toString('utf-8').split('\n').forEach((line) => {
    if (line.startsWith('%output')) {
      line = line.replace(/%output %\d+ /, '');
      line = line.replace(/\\(\d+)/g, (_, match) => String.fromCharCode(parseInt(match, 8)));
      console.log(line);
      terminal.write(line);
    }
  });
};


terminal.on('key', (key, event) => {
  console.log(key, event);
  const printable = !event.altKey && !event.altGraphKey && !event.ctrlKey && !event.metaKey;
  // if (key === 'Backspace') {
  //   key = 'BSpace';
  // }

  // if (key === ' ') {
  //   key = 'Space';
  // }

  // if (key === '"') {
  //   key = '\"'
  // }

  // if (key === 'Control' || key === 'Shift' || key === 'Meta') {
  //   return;
  // }

  // if (key.startsWith('Arrow')) {
  //   key = key.replace('Arrow', '');
  // }


  // if (event.ctrlKey) {
  //   key = `C-${event.key}`;
  // }

  // keys = keys + key;
  // if (event.key === 'Enter') {
  //   socket.send(keys);
  //   keys = '';
  // } else {
  //   terminal.write(key);
  // }
  socket.send(`send-keys "${key}"`);


});

// });

@Component
export default class Pane extends Vue {
  @Prop() private msg!: string;
}
</script>
