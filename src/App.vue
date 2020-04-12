<template>
  <div id="app">
    <UiToolbar id="header" brand="PlatMaster" :title="header" removeNavIcon></UiToolbar>
    <div id="rest">
      <Welcome
        v-if="!project"
        @newProject="newProject"
      />
      <Editor
        v-if="project"
      />
    </div>
  </div>
</template>

<style scoped>
  #app {
    display: flex;
    flex-direction: column;
  }
  #header {
    flex: 0 0 56px;
    padding-left: 4rem;
  }
  #rest {
    flex: 1 1 auto;
  }
</style>

<script>

import {UiToolbar} from 'keen-ui';

import Editor from './components/Editor.vue';
import Project from './Project.js';
import Welcome from './components/Welcome.vue';
import {state} from './main.js';

export default {
  name: 'App',
  data() {
    return state;
  },
  methods: {
    newProject() {
      state.project = new Project();
    }
  },
  components: {
    UiToolbar,
    Welcome
  }
};

</script>
