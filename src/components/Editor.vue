<template>
  <div id="editor">
    <!-- <EditorMap v-else></EditorMap> -->
  </div>
</template>

<style scoped>

</style>

<script>

// import {
//   UiButton
// } from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {state} from '../main.js';
// import DocumentAdd from './DocumentAdd';
// import Project from '../Project.js';
import {
  formatDate
} from '../viz.js';

export default {
  name: 'Editor',
  mounted() {
    if (this.pages.length < 1) {
      return;
    }
  },
  data() {
    return state;
  },
  methods: {
    newProject() {
      this.$emit('newProject');
    }
  },
  components: {
    // UiButton
  }
};

</script>
