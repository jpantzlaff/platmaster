<template>
  <div id="editor">
      <EditorMap></EditorMap>
  </div>
</template>

<style scoped>

</style>

<script>

import {UiButton} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

export default {
  name: 'Editor',
  data() {
    return {recents};
  },
  methods: {
    newProject() {
      this.$emit('newProject');
    }
  },
  components: {
    UiButton
  }
};

</script>
