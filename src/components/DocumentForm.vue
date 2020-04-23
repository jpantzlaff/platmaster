<template>
  <div class="document-form">
    <UiTextbox
      v-model="form.name"
      label="Project name"
      error="A name must be provided."
      :invalid="!nameValid"
    />
    <UiSelect
      v-model="form.distanceUnit"
      label="Unit of distance"
      :options="distanceUnits"
    />
    <UiSelect
      v-model="form.bearingBasisType"
      label="Basis of bearings"
      :options="['Grid', 'True/geodetic north', 'Magnetic north']"
    />
    <UiSelect
      v-if="form.bearingBasisType === 'Grid'"
      v-model="form.crs"
      label="Coordinate reference system of the grid"
      placeholder="Search a projection name, location, or SRID code"
      :disableFilter="true"
      :hasSearch="true"
      :loading="crsLoading"
      :no-results="crsNoResult"
      :options="crsOptions"
      @query-change="crsQuery"
      error="A coordinate reference system must be specified."
      :invalid="!crsValid"
    />
    <UiDatepicker
      v-if="form.bearingBasisType === 'Magnetic north'"
      v-model="form.bearingBasisDate"
      :customFormatter="formatDate"
      label="Date of survey (approximate)"
      error="A date must be provided."
      :invalid="!dateValid"
    />
    <UiButton
      class="continue"
      v-if="!edit && isValid"
      size="large"
      icon="library_add"
      v-on:click="createProject"
    >
      Start
    </UiButton>
  </div>
</template>

<style scoped>
</style>

<script>

import {
  UiButton,
  UiDatepicker,
  UiSelect,
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {distanceUnits} from '../env.js';
import {state} from '../main.js';
import {queryProj} from '../util.js';
import {formatDate} from '../viz.js';

export default {
  name: 'DocumentForm',
  computed: {
    crsValid() {
      if (this.form.bearingBasisType === 'Grid') {
        const keys = Object.keys(this.form.crs);
        return (keys.includes('label') && keys.includes('value'));
      } else {
        return true;
      }
    },
    dateValid() {
      if (this.form.bearingBasisType === 'Magnetic north') {
        return (this.form.bearingBasisDate instanceof Date);
      } else {
        return true;
      }
    },
    isValid() {
      return (this.crsValid && this.dateValid && this.nameValid);
    },
    nameValid() {
      return (this.form.name.length > 0);
    }
  },
  data() {
    return {
      crsLoading: false,
      crsNoResult: false,
      crsOptions: [],
      distanceUnits,
      form: state.form
    };
  },
  methods: {
    async crsQuery(term) {
      this.crsLoading = true;
      queryProj(term)
        .then((results) => {
          this.crsNoResult = false;
          this.crsOptions = results.map((r) => {
            return {
              label: `SRID:${r.code} – ${r.name}`,
              value: r
            };
          });
        })
        .catch(() => this.crsNoResult = true)
        .finally(() => this.crsLoading = false);
    },
    formatDate,
    submitForm() {}
  },
  watch: {
    'form.bearingBasisType': function(value) {
      if (value !== 'Magnetic north') {
        this.form.bearingBasisDate = null;
      }
    }
  },
  components: {
    UiButton,
    UiDatepicker,
    UiSelect,
    UiTextbox
  }
};

</script>