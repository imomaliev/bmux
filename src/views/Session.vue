<template>
  <div class="home">
    <Pane/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Pane from '@/components/Pane.vue'; // @ is an alias to /src

@Component({
  components: {
    Pane,
  },
})
export default class Home extends Vue {}
</script>
