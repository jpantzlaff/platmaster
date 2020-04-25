<template>
  <UiModal
    ref="modal"
    size="large"
    title="Settings"
    transition="fade"
    dismissOn="close-button esc"
    @close="save"
  >
    <div class="settings-section">
      <h2 class="settings-section-title">Colors</h2>
      <div class="settings-group">
        <div class="setting">
          <h3>Primary</h3>
          <ColorPicker v-model="color1" />
        </div>
        <div class="setting">
          <h3>Secondary</h3>
          <ColorPicker v-model="color2" />
        </div>
        <div class="setting">
          <h3>Text</h3>
          <ColorPicker v-model="colorText" />
        </div>
      </div>
      <UiCheckbox
        v-model="darkEditor"
        label="Invert color of documents in editor"
      />
    </div>
    <div class="settings-section">
      <h2 class="settings-section-title">Dates</h2>
      <div class="settings-group">
        <div class="setting">
          <UiSelect
            v-model="dateFormat"
            label="Date format"
            :options="['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY']"
          />
        </div>
      </div>
    </div>
    <div class="settings-section input-settings">
      <h2 class="settings-section-title">Input</h2>
      <div class="settings-group">
        <div class="setting">
          <UiSelect
            v-model="directionFormat"
            label="Direction format"
            :options="['45.56', 'N 45-33-36 E', 'N 45.33.36 E']"
            help="When inputting, letters are case insensitive and spaces are ignored"
          />
        </div>
      </div>
    </div>
  </UiModal>
</template>

<style scoped>
  .input-settings .setting {
    margin-bottom: 0;
  }
  .settings-group {
    display: flex;
    margin: -1em;
  }
  .settings-section:not(:last-child) {
    margin-bottom: 1.5rem;
  }
  .settings-section-title {
    margin-top: 0;
  }
  .setting {
    flex: 1 0 auto;
    margin: 1em;
  }
  .setting > h3 {
    margin-top: 0;
  }
  .vc-chrome {
    width: 100%;
  }
  .ui-checkbox {
    margin-top: 2em;
  }
</style>
<style>
  .form > div {
    margin-bottom: 1.5rem;
  }
  .input-settings .ui-select__feedback-text {
    color: var(--light-text-color, #000000) !important;
  }
  .vc-chrome-toggle-btn {
    display: none;
  }
  .vc-editable-input > span {
    display: none !important;
  }
  .vc-input__input {
    color: #333333 !important;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
  }
</style>

<script>

import {
  UiCheckbox,
  UiModal,
  UiSelect
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import {Chrome as ColorPicker} from 'vue-color';

import {
  saveSettings as save,
  state
} from '../main.js';
import {
  setAccentColor,
  setBackgroundColor,
  setEditorColor,
  setTextColor
} from '../viz.js';

export default {
  name: 'Settings',
  data() {
    return state.settings;
  },
  methods: {
    open() {
      this.$refs.modal.open();
    },
    save
  },
  watch: {
    color1: (value) => setBackgroundColor(value.hex),
    color2: (value) => setAccentColor(value.hex),
    colorText: (value) => setTextColor(value.hex),
    darkEditor: (value) => setEditorColor(value)
  },
  components: {
    ColorPicker,
    UiCheckbox,
    UiModal,
    UiSelect
  }
};

</script>