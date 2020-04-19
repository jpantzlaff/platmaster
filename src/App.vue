<template>
  <div id="app">
    <UiToolbar id="header" brand="PlatMaster" :title="header" removeNavIcon />
    <UiIconButton
      id="close"
      icon="close"
      size="small"
      v-if="activeView !== 'welcome'"
      v-on:click="home"
    />
    <div id="rest">
      <Templates v-if="activeView === 'templates'" />
      <Projects v-else-if="activeView === 'projects'" />
      <Editor v-else-if="activeView === 'editor'" />
      <Welcome v-else />
    </div>
  </div>
</template>

<style scoped>
  #app {
    display: flex;
    flex-direction: column;
  }
  #close {
    background-color: transparent !important;
    position: absolute;
    right: 1rem;
    top: 0.75rem;
  }
  #header {
    background-color: var(--color2, #ffffff);
    flex: 0 0 56px;
    padding-left: 4rem;
  }
  #rest {
    background-color: var(--color1, #ffffff);
    flex: 1 1 auto;
    height: 0;
  }
</style>

<script>

import {
  UiIconButton,
  UiToolbar
} from 'keen-ui';

import Editor from './components/Editor.vue';
import Projects from './components/Projects.vue';
import Templates from './components/Templates.vue';
import Welcome from './components/Welcome.vue';
import {state} from './main.js';

export default {
  name: 'App',
  data() {
    return state;
  },
  methods: {
    home() {
      state.header = null;
      state.activeView = 'welcome';
    }
  },
  components: {
    Editor,
    Projects,
    Templates,
    UiIconButton,
    UiToolbar,
    Welcome
  }
};

</script>
