<template>
  <UiModal
    ref="modal"
    size="large"
    title="Appearance"
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
      <UiSwitch v-model="darkEditor" label="Use dark mode in editor" />
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
    <!-- <div class="settings-section">
      <h2 class="settings-section-title">Text</h2>
      <h3>Scale</h3>
      <UiSlider
        v-model="fontScale"
        :min="70"
        :max="130"
      />
    </div> -->
  </UiModal>
</template>

<style scoped>
  .settings-group {
    display: flex;
    margin: -1em;
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
  UiModal,
  UiSelect,
  // UiSlider,
  UiSwitch
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import {Chrome as ColorPicker} from 'vue-color';

import {db, state} from '../main.js';
import {
  setAccentColor,
  setBackgroundColor,
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
      console.log(JSON.stringify(state.appearance));
      const {color1, color2, colorText, darkEditor, dateFormat, timeFormat} = state.appearance;
      db.insert('settings', {
        id: 1,
        color1: (typeof color1 === 'string') ? color1 : color1.hex,
        color2: (typeof color2 === 'string') ? color2 : color2.hex,
        colorText: (typeof colorText === 'string') ? colorText : colorText.hex,
        darkEditor,
        dateFormat,
        timeFormat
        // fontScale
      }, true);
    }
  },
  watch: {
    color1: (value) => setBackgroundColor(value.hex),
    color2: (value) => setAccentColor(value.hex),
    colorText: (value) => setTextColor(value.hex)
    // fontScale: (value) => setTextScale(value)
  },
  components: {
    ColorPicker,
    UiModal,
    UiSelect,
    UiSwitch
  }
};

</script>