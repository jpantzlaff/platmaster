<template>
  <div class="viewer">
    <div class="ol"></div>
    <div
      class="switcher"
      v-if="state.pages.length > 1"
    >
      <UiIconButton
        class="advance"
        icon="arrow_back_ios"
        size="mini"
        tooltip="View previous page"
        :disabled="state.activePage.id <= 1"
        v-on:click="backward"
      />
      <p class="page-number">{{state.activePage.id}}</p>
      <UiIconButton
        class="advance"
        icon="arrow_forward_ios"
        size="mini"
        tooltip="View next page"
        :disabled="state.activePage.id >= state.pages.length"
        v-on:click="forward"
      />
    </div>
  </div>
</template>

<style scoped>
  .switcher {
    bottom: 2rem;
    display: flex;
    left: 2rem;
    position: absolute;
  }
</style>

<script>

import {
  UiIconButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {distanceUnits, magDeclinationYears} from '../env.js';
import {state} from '../main.js';
import Page from '../Page.js';
import {queryProj} from '../util.js';
import {formatDate} from '../viz.js';

export default {
  name: 'Viewer',
  computed: {
  },
  data() {
    return {state};
  },
  methods: {
    backward() {

    },
    forward() {

    }
  },
  watch: {
    'state.activePage': function(value) {

    }
  },
  components: {
    UiIconButton
  }
};

</script>