<template>
  <div id="app">
    <UiToolbar class="header" brand="PlatMaster" :title="header" removeNavIcon />
    <div class="settings">
      <UiIconButton
        class="setting-button"
        icon="keyboard"
        size="small"
        tooltip="Appearance settings"
        v-on:click="openAppearanceSettings"
      />
      <UiIconButton
        class="setting-button"
        icon="color_lens"
        size="small"
        tooltip="Input settings"
        v-on:click="openInputSettings"
      />
    </div>
    <div class="rest">
      <Editor />
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
    background-color: var(--color2, #ffffff);
    flex: 0 0 56px;
    padding-left: 4rem;
  }
  .rest {
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

import AppearanceSettings from './components/AppearanceSettings.vue';
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
    Editor,
    InputSettings,
    UiIconButton,
    UiToolbar
  }
};

</script>
