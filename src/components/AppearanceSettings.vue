<template>
  <UiModal
    ref="modal"
    size="large"
    title="Appearance"
  >
    <div class="settings-section">
      <h2 class="settings-section-title">Colors</h2>
      <div id="colors">
        <div class="color">
          <h3>Primary</h3>
          <ColorPicker v-model="color1" />
        </div>
        <div class="color">
          <h3>Secondary</h3>
          <ColorPicker v-model="color2" />
        </div>
        <div class="color">
          <h3>Text</h3>
          <ColorPicker v-model="colorText" />
        </div>
      </div>
      <UiSwitch v-model="darkEditor" label="Use dark mode in editor" />
    </div>
    
    <h2 class="settings-section-title">Date and time</h2>
    <h2 class="settings-section-title">Fonts</h2>
  </UiModal>
</template>

<style scoped>
  #colors {
    display: flex;
    margin: -1em;
  }
  .color {
    flex: 1 0 auto;
    margin: 1em;
  }
  .color > h3 {
    margin-top: 0;
  }
  .vc-chrome {
    width: 100%;
  }
</style>
<style>
  .vc-chrome-toggle-btn {
    display: none;
  }
  .vc-editable-input > span {
    display: none !important;
  }
</style>

<script>

import {
  UiButton,
  UiModal,
  UiSelect,
  UiSwitch
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import {Chrome as ColorPicker} from 'vue-color';

import {globalStyle, state} from '../main.js';

export default {
  name: 'Welcome',
  data() {
    return state.appearance;
  },
  methods: {
    open() {
      this.$refs.modal.open();
    }
  },
  watch: {
    color1: (value) => globalStyle.setBackgroundColor(value.hex),
    color2: (value) => globalStyle.setAccentColor(value.hex),
    colorText: (value) => globalStyle.setTextColor(value.hex)
  },
  components: {
    ColorPicker,
    // UiButton,
    UiModal,
    // UiSelect,
    UiSwitch
  }
};

</script>