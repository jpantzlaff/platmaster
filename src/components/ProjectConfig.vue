<template>
  <div>
    <UiTextbox
      v-model="name"
      label="Project name"
    />
    <UiSelect
      v-model="unit"
      label="Unit of distance"
      :options="[
        {label: 'Meter', value: 1},
        {label: 'Foot (International)', value: 0.3048},
        {label: 'Foot (US)', value: 0.3048006096012192}
      ]"
    />
    <UiSelect
      v-model="bearingBasisType"
      label="Basis of bearings"
      :options="['Grid (A coordinate system)', 'True north', 'Magnetic north', 'None']"
    />
    <UiDatepicker
      v-if="bearingbasis"
      v-model="bearingBasis.kind"
      label="Date of survey (may be approximate)"
      :options="['']"
    />
  </div>
</template>

<style scoped>
</style>

<script>

import {
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import {Chrome as ColorPicker} from 'vue-color';

import {db, state} from '../main.js';

export default {
  name: 'ProjectConfig',
  data() {
    return {
      // Collect: name, distance unit, bearing basis (CRS, true north, magnetic north and date, none/other), distance basis (ground/none, CRS), target CRS
      name: 'Untitled',
      unit: 'Meter',
      bearingBasisType: 'None',
      distanceBasis: null,
      targetCrs: null
    };
  },
  methods: {
    submit: 
  },
  // watch: {
  // },
  components: {
    UiDatepicker,
    UiSelect,
    UiTextbox
  }
};

</script>