<template>
  <div id="terminal" ref="terminal"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import ws from 'ws';
import { Terminal } from 'xterm';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';

// import * as attach from 'xterm/lib/addons/attach/attach';
// import * as fit from 'xterm/lib/addons/fit/fit';

@Component
export default class Pane extends Vue {
  $refs!: {
    terminal: HTMLElement,
  };

  mounted() {
    // Terminal.applyAddon(attach);
    // Terminal.applyAddon(fit);
    Terminal.applyAddon(fullscreen);

    const socket = new WebSocket('ws://localhost:3000');
    const terminal = new Terminal();

    // https://github.com/vuejs/vue-class-component/issues/94#issuecomment-298813210
    terminal.open(this.$refs.terminal);
    (terminal as any).toggleFullScreen(true);
    // terminal.fit();
    // window.scrollTo(0,document.querySelector("#terminal").scrollHeight);

    // const keys = '';

    socket.onmessage = (event) => {
      event.data.toString('utf-8').split('\n').forEach((line: string) => {
        if (line.startsWith('%output')) {
          line = line.replace(/%output %\d+ /, '');
          line = line.replace(/\\(\d+)/g, (_, match) => String.fromCharCode(parseInt(match, 8)));
          console.log(line);
          terminal.write(line);
        }
      });
    };

    terminal.on('paste', (data) => {
        socket.send(`send-keys "${data}"`);
    });

    terminal.on('key', (key, event) => {
      console.log(key, event);
      // const printable = !event.altKey && !event.altGraphKey && !event.ctrlKey && !event.metaKey;
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
  }
}
</script>

<!-- https://vuejs.org/v2/guide/single-file-components.html#What-About-Separation-of-Concerns -->
<styes src="xterm/dist/xterm.css">
</styes>
