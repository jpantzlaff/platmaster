<template>
  <div id="app">
    <UiToolbar class="header" brand="PlatMaster" :title="form.name || 'New document'" removeNavIcon />
    <div class="settings">
      <UiIconButton
        class="setting-button"
        icon="keyboard"
        size="normal"
        tooltip="Appearance settings"
        v-on:click="openAppearanceSettings"
      />
      <UiIconButton
        class="setting-button"
        icon="color_lens"
        size="normal"
        tooltip="Input settings"
        v-on:click="openInputSettings"
      />
    </div>
    <div class="rest">
      <Editor v-if="false" />
      <DocumentForm v-else />
    </div>
    <AppearanceSettings ref="appearanceSettings" />
    <InputSettings ref="inputSettings" />
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

import AppearanceSettings from './components/AppearanceSettings.vue';
import DocumentForm from './components/DocumentForm.vue';
import Editor from './components/Editor.vue';
import InputSettings from './components/InputSettings.vue';
import {state} from './main.js';

export default {
  name: 'App',
  data() {
    return state;
  },
  methods: {
    openAppearanceSettings() {
      this.$refs.appearanceSettings.open();
    },
    openInputSettings() {
      this.$refs.inputSettings.open();
    }
  },
  components: {
    AppearanceSettings,
    DocumentForm,
    Editor,
    InputSettings,
    UiIconButton,
    UiToolbar
  }
};

</script>
