<template>
  <UiModal
    ref="modal"
    size="large"
    title="New project"
    dismissOn="close-button esc"
  >
    <UiTextbox
      v-model="name"
      label="Project name"
    />
    <UiSelect
      v-model="distanceUnit"
      label="Unit of distance"
      :options="[
        {label: 'Meter', value: 1},
        {label: 'Foot (International)', value: 0.3048},
        {label: 'Foot (US)', value: 0.3048006096012192}
      ]"
    />
    <UiSelect
      v-model="distanceBasisType"
      label="Basis of distances"
      :options="['Grid', 'Ground']"
      v-on:input="enforceBearingBasis"
    />
    <UiSelect
      v-if="distanceBasisType === 'Ground'"
      v-model="bearingBasisType"
      label="Basis of bearings"
      :options="['Grid', 'True/geodetic north', 'Magnetic north', 'None']"
    />
    <UiSelect
      v-if="distanceBasisType === 'Grid' || bearingBasisType === 'Grid'"
      v-model="crs"
      label="Coordinate reference system of the grid"
      :disableFilter="true"
      :hasSearch="true"
      :loading="crsLoading"
      :no-results="crsNoResult"
      :options="crsOptions"
      @query-change="crsQuery"
    />
    <UiDatepicker
      v-if="bearingBasisType === 'Magnetic north'"
      v-model="magDeclDate"
      :customFormatter="formatDate"
      label="Date of survey (approximate)"
    />
  </UiModal>
</template>

<style scoped>
</style>

<script>

import {
  UiDatepicker,
  UiModal,
  UiSelect,
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import {Chrome as ColorPicker} from 'vue-color';

import Crs from '../crs.js';
import {db, state} from '../main.js';
import {formatDate} from '../viz.js';

export default {
  name: 'ProjectCreate',
  data() {
    return {
      // Collect: name, distance unit, bearing basis (CRS, true north, magnetic north and date, none/other), distance basis (ground/none, CRS), target CRS
      name: 'Untitled',
      distanceUnit: {label: 'Meter', value: 1},
      distanceBasisType: 'Ground',
      bearingBasisType: 'None',
      crsLoading: false,
      crsNoResult: false,
      crs: {},
      crsOptions: [],
      magDeclDate: null
    };
  },
  methods: {
    async crsQuery(term) {
      this.$data.crsLoading = true;
      Crs.queryProj(term)
        .then((results) => {
          this.$data.crsNoResult = false;
          this.$data.crsOptions = results.map((r) => {
            return {
              label: `SRID:${r.code} – ${r.name}`,
              value: r
            };
          });
        })
        .catch(() => this.$data.crsNoResult = true)
        .finally(() => this.$data.crsLoading = false);
    },
    enforceBearingBasis() {
      if (this.$data.distanceBasisType === 'Grid') {
        this.$data.bearingBasisType = 'Grid';
      }
    },
    formatDate,
    open() {
      this.$refs.modal.open();
    }
  },
  // watch: {
  // },
  components: {
    UiDatepicker,
    UiModal,
    UiSelect,
    UiTextbox
  }
};

</script>