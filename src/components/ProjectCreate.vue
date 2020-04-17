<template>
  <UiModal
    ref="modal"
    size="large"
    title="New project"
    dismissOn="close-button esc"
  >
    <UiTextbox
      v-model="template.name"
      label="Project name"
    />
    <UiSelect
      v-model="template.distanceUnit"
      label="Unit of distance"
      :options="template.distanceUnits"
    />
    <UiSelect
      v-model="template.distanceBasisType"
      label="Basis of distances"
      :options="['Grid', 'Ground']"
      v-on:input="enforceBearingBasis"
    />
    <UiSelect
      v-if="distanceBasisType === 'Ground'"
      v-model="template.bearingBasisType"
      label="Basis of bearings"
      :options="['Grid', 'True/geodetic north', 'Magnetic north', 'None']"
    />
    <UiSelect
      v-if="distanceBasisType === 'Grid' || bearingBasisType === 'Grid'"
      v-model="template.crs"
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
      v-model="template.date"
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
  props: {
    project: Object
  },
  data() {
    return {
      // name: 'Untitled',
      // distanceUnit: {label: 'Meter', value: 1},
      // distanceBasisType: 'Ground',
      // bearingBasisType: 'None',
      crsLoading: false,
      crsNoResult: false,
      // crs: {},
      crsOptions: [],
      // magDeclDate: null
      template: this.$props.project
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