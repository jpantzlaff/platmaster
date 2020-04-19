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
      <div class="settings-group">
        <div class="setting">
          <UiSelect
            v-model="directionFormat"
            label="Direction format"
            :options="['45.56', 'N 45-33-36 E', 'N 45.33.36 E']"
            help="When inputting, letters are case insensitive and spaces are ignored"
          />
        </div>
        <div class="setting">
          <UiSelect
            v-model="distanceFormat"
            label="Distance format"
            :options="['1234.56', '1234,56', '1,234.56', '1.234,56', '1 234.56', '1 234,56']"
            help="When inputting, spaces are ignored"
          />
        </div>
      </div>
    </div>
    <div class="settings-section">
      <h2 class="settings-section-title">Key bindings</h2>
      <div class="key-bindings">
        <template v-for="(hotkey, action) in hotkeys">
          <div
            :key="action"
            class="key-binding"
          >
            <p>{{hotkey.name}}</p>
            <UiTextbox
              v-model="hotkey.display"
              class="key-combo"
              :disabled="true"
            />
          </div>
        </template>
      </div>
    </div>
  </UiModal>
</template>

<style scoped>
  .key-binding {
    align-items: center;
    display: flex;
    flex: 0 1 50%;
    justify-content: space-between;
    padding: 0 2rem;
  }
  .key-bindings {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -2rem;
  }
  .key-combo {
    flex: 0 0 6em;
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
  .settings-group {
    display: flex;
    margin: -1em;
  }
</style>
<style>
  #input-settings .ui-select__feedback-text {
    color: var(--light-text-color, #000000) !important;
  }
  #input-settings .ui-modal__body {
    overflow-x: hidden;
  }
  .key-binding .ui-textbox__input {
    text-align: center;
  }
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
    return state.input;
  },
  methods: {
    open() {
      this.$refs.modal.open();
    },
    save() {
      return;
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