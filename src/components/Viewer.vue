<template>
  <div class="viewer">
    
  </div>
</template>

<style scoped>
</style>

<script>

// import {
//   UiButton,
//   UiDatepicker,
//   UiFileupload,
//   UiSelect,
//   UiTextbox
// } from 'keen-ui';
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
  },
  watch: {
  },
  components: {
    // UiButton,
    // UiDatepicker,
    // UiFileupload,
    // UiSelect,
    // UiTextbox
  }
};

</script>