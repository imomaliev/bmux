<template>
  <div id="app">
    <Pane />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Pane from './components/Pane.vue';

@Component({
  components: {
    Pane,
  },
})
export default class App extends Vue {}
</script>

<style>
</style>
