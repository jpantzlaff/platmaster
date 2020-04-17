<template>
  <div id="app">
    <UiToolbar id="header" brand="PlatMaster" :title="header" removeNavIcon />
    <UiFab
      id="close"
      icon="close"
      size="small"
      v-if="activeView !== 'welcome'"
      v-on:click="home"
    />
    <div id="rest">
      <Welcome
        v-if="activeView === 'welcome'"
      />
      <Templates
        v-if="activeView === 'templates'"
      />
      <!-- <Editor
        v-if="activeView='editor'"
      /> -->
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
    box-shadow: none;
    position: absolute;
    right: 1rem;
    top: 0.5rem;
  }
  #header {
    background-color: var(--color2, #ffffff);
    flex: 0 0 56px;
    padding-left: 4rem;
  }
  #rest {
    background-color: var(--color1, #ffffff);
    flex: 1 1 auto;
  }
</style>

<script>

import {
  UiFab,
  UiToolbar
} from 'keen-ui';

import Editor from './components/Editor.vue';
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
      state.activeView = 'welcome';
      state.header = null;
    }
  },
  components: {
    // Editor,
    Templates,
    UiFab,
    UiToolbar,
    Welcome
  }
};

</script>
