<template>
  <UiModal
    id="input-settings"
    ref="modal"
    size="large"
    title="Input"
    dismissOn="close-button esc"
    @close="save"
  >
    <div class="settings-section">
      <h2 class="settings-section-title">Direction and distance</h2>
      <UiSelect
        :v-model="directionFormat"
        label="Direction format"
        :options="['DD.DD', 'D-M-S', 'D.M.S']"
        help='"DD" = decimal degrees, "D" = whole degrees, "M" = minutes, "S" = seconds'
      />
      <UiSelect
        :v-model="distanceFormat"
        label="Distance format"
        :options="['1234.56', '1234,56', '1,234.56', '1.234,56', '1 234.56', '1 234,56']"
      />
    </div>
    <div class="settings-section">
      <h2 class="settings-section-title">Key bindings</h2>
      <div class="key-bindings">
        <template v-for="(action, hotkey) in hotkeys">
          <div
            :key="action"
            class="key-binding"
          >
            <p>{{hotkey.name}}</p>
            <UiTextbox
              :v-model="hotkey.key"
              :disabled="true"
            />
          </div>
        </template>
      </div>
    </div>
  </UiModal>
</template>

<style scoped>
  .settings-section:not(:last-child) {
    margin-bottom: 2.5rem;
  }
  .settings-section-title {
    margin-top: 0;
  }
  /* .setting {
    flex: 1 0 auto;
    margin: 1em;
  }
  .setting > h3 {
    margin-top: 0;
  } */
</style>

<script>

import {
  UiModal,
  UiSelect,
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {db, state} from '../main.js';
import {
  setAccentColor,
  setBackgroundColor,
  setEditorColor,
  setTextColor,
  setTextScale
} from '../viz.js';

export default {
  name: 'InputSettings',
  data() {
    console.log(state.input);
    return state.input;
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
  },
  components: {
    UiModal,
    UiSelect,
    UiTextbox
  }
};

</script>