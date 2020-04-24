<template>
  <div class="point-form">
    <div class="x-row">
      <p>X:</p>
      <UiTextbox
        v-model="point.x"
        class="x"
        type="number"
      />
    </div>
    <div class="y-row">
      <p>Y:</p>
      <UiTextbox
        v-model="point.y"
        class="y"
        type="number"
      />
    </div>
    <UiSelect
      v-if="form.bearingBasisType === 'Grid'"
      v-model="point.crs"
      label="Coordinate reference system of the grid"
      placeholder="Search a projection name, location, or SRID code"
      :disableFilter="true"
      :hasSearch="true"
      :loading="crsLoading"
      :no-results="crsNoResult"
      :options="crsOptions"
      @query-change="crsQuery"
      error="A CRS must be specified."
      :invalid="!crsValid"
    />
    <UiButton
      class="submit"
      v-if="isValid"
      size="large"
      icon="check"
      v-on:click="submitForm"
    >
      Confirm
    </UiButton>
  </div>
</template>

<style scoped>
  .point-form {

  }
</style>

<script>

import {
  UiButton,
  UiSelect,
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {state} from '../main.js';
import {queryProj} from '../util.js';

export default {
  name: 'AbsolutePointForm',
  computed: {
    crsValid() {
      if (this.form.bearingBasisType === 'Grid') {
        const keys = Object.keys(this.form.crs);
        return (keys.includes('label') && keys.includes('value'));
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      state,
      point: state.pendingPoint,
      crsLoading: false,
      crsNoResult: false,
      crsOptions: []
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
    submitForm() {
      state.pages = Array.from(this.form.files).map((file, id) => {
        return new Page({
          file,
          id
        });
      });
    }
  },
  watch: {
  },
  components: {
    UiButton,
    UiSelect,
    UiTextbox
  }
};

</script>