<template>
  <div id="app">
    <UiToolbar class="header" brand="PlatMaster" :title="title" removeNavIcon />
    <div class="settings">
      <UiIconButton
        class="setting-button"
        icon="settings"
        size="normal"
        tooltip="Application settings"
        v-on:click="openSettings"
      />
    </div>
    <div class="rest">
      <Editor v-if="false" />
      <DocumentForm v-else />
    </div>
    <Settings ref="settings" />
  </div>
</template>

<style scoped>
  #app {
    display: flex;
    flex-direction: column;
  }
  .header {
    background-color: var(--color2);
    flex: 0 0 56px;
    padding-left: 4rem;
  }
  .rest {
    background-color: var(--color1);
    flex: 1 1 auto;
    height: 0;
  }
  .setting-button {
    margin-right: 1rem;
  }
  .settings {
    align-items: center;
    display: flex;
    height: 56px;
    position: absolute;
    right: 0;
    top: 0;
  }
</style>

<script>

import {
  UiIconButton,
  UiToolbar
} from 'keen-ui';

import DocumentForm from './components/DocumentForm.vue';
import Editor from './components/Editor.vue';
import Settings from './components/Settings.vue';
import {state} from './main.js';

export default {
  name: 'App',
  computed: {
    title() {
      return 'New document' + ((state.form.name) ? (': ' + state.form.name) : '');
    }
  },
  data() {
    return state;
  },
  methods: {
    openSettings() {
      this.$refs.settings.open();
    }
  },
  components: {
    DocumentForm,
    Editor,
    Settings,
    UiIconButton,
    UiToolbar
  }
};

</script>
