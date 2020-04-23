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
  </UiModal>
</template>

<style scoped>
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
</style>

<script>

import {
  UiModal,
  UiSelect
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {
  saveSettings as save,
  state
} from '../main.js';

export default {
  name: 'InputSettings',
  data() {
    return state.settings;
  },
  methods: {
    open() {
      this.$refs.modal.open();
    },
    save
  },
  components: {
    UiModal,
    UiSelect
  }
};

</script>