<template>
  <div id="editor">
    <DocumentAdd v-if="documentAddOpen" />
    <div
      class="no-documents"
      v-if="project.documents.length < 1"
    >
      <h3>This project doesn't have any documents added to it yet.</h3>
    </div>
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
import DocumentAdd from './DocumentAdd';
import Project from '../Project.js';
import {
  formatDate,
  formatTime
} from '../viz.js';

export default {
  name: 'Editor',
  mounted() {
    if (this.project.documents.length < 1) {
      this.documentAddOpen = true;
    }
  },
  data() {
    return {
      ...state,
      documentAddOpen: false,
      project: state.project
    };
  },
  methods: {
    newProject() {
      this.$emit('newProject');
    }
  },
  components: {
    DocumentAdd
    // UiButton
  }
};

</script>
