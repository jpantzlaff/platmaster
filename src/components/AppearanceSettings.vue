<template>
  <UiModal
    id="appearance-settings"
    ref="modal"
    size="large"
    title="Appearance"
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
      <h2 class="settings-section-title">Dates and times</h2>
      <div class="settings-group">
        <div class="setting">
          <UiSelect
            v-model="dateFormat"
            label="Date format"
            :options="['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY']"
          />
        </div>
        <div class="setting">
          <UiSelect
            v-model="timeFormat"
            label="Time format"
            :options="['12-hour', '24-hour']"
          />
        </div>
      </div>
    </div>
  </UiModal>
</template>

<style scoped>
  .settings-group {
    display: flex;
    margin: -1em;
  }
  .settings-section:not(:last-child) {
    margin-bottom: 2.5rem;
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

import {db, state} from '../main.js';
import {
  setAccentColor,
  setBackgroundColor,
  setEditorColor,
  setTextColor,
  setTextScale
} from '../viz.js';

export default {
  name: 'AppearanceSettings',
  data() {
    return state.appearance;
  },
  methods: {
    open() {
      this.$refs.modal.open();
    },
    save() {
      const {color1, color2, colorText, darkEditor, dateFormat, timeFormat} = state.appearance;
      db.insert('settings', {
        id: 1,
        color1: (typeof color1 === 'string') ? color1 : color1.hex,
        color2: (typeof color2 === 'string') ? color2 : color2.hex,
        colorText: (typeof colorText === 'string') ? colorText : colorText.hex,
        darkEditor,
        dateFormat,
        timeFormat
      }, true);
    }
  },
  watch: {
    color1: (value) => setBackgroundColor(value.hex),
    color2: (value) => setAccentColor(value.hex),
    colorText: (value) => setTextColor(value.hex),
    darkEditor: (value) => setEditorColor(value ? 'black' : 'white')
  },
  components: {
    ColorPicker,
    UiCheckbox,
    UiModal,
    UiSelect
  }
};

</script>