<template>
  <div class="coordinate">
    <div class="xy">
      <p class="xy-label">X:</p>
      <UiTextbox
        v-model="x"
        class="x"
        ref="x"
      />
      <p class="xy-label">Y:</p>
      <UiTextbox
        v-model="y"
        class="y"
        ref="y"
      />
    </div>
    <div
      class="bottom"
    >
      <UiSelect
        v-model="crs"
        class="crs"
        :disableFilter="true"
        :hasSearch="true"
        :loading="crsLoading"
        :no-results="crsNoResult"
        :options="crsOptions"
        @query-change="crsQuery"
      />
      <UiIconButton
        class="confirm"
        icon="check"
        :disabled="!valid"
        v-on:click="confirm"
      />
    </div>
  </div>
</template>

<style scoped>
  .bottom {
    display: flex;
  }
  .confirm {
    flex: 0 0 auto;
    margin-left: 0.5rem;
  }
  .coordinate {
    background-color: var(--color2);
    border: 0.5px solid var(--light-text-color);
    padding: 0 0.5rem;
    position: absolute;
    width: 15rem;
    z-index: 10000;
  }
  .crs {
    flex: 1 1 auto;
  }
  .xy {
    align-items: center;
    display: flex;
    padding: 0 0.1rem;
  }
  .xy-label {
    flex: 0 0 auto;
    margin: 0 0.4em 0 0;
  }
  .x {
    margin-right: 0.75em;
  }
  .x, .y {
    flex: 1 0 30%;
  }
</style>
<style>
  .x input, .y input {
    text-align: right;
    text-overflow: ellipsis;
  }
  .ui-select__dropdown-content {
    min-width: 320px;
  }
</style>

<script>

import {
  UiIconButton,
  UiSelect,
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {state} from '../main.js';
import CRS from '../crs.js';

export default {
  name: 'Coordinate',
  computed: {
    valid() {
      return Boolean(this.xValid && this.yValid && this.crs.value);
    },
    xValid() {
      return Boolean(Number(this.x));
    },
    yValid() {
      return Boolean(Number(this.y));
    }
  },
  data() {
    return {
      crs: state.project.documentCrs || {},
      crsLoading: false,
      crsNoResult: false,
      crsOptions: [],
      x: null,
      y: null
    };
  },
  methods: {
    confirm() {

    },
    // newProject() {
    //   this.$emit('newProject');
    // },
    async crsQuery(term) {
      this.crsLoading = true;
      CRS.queryProj(term)
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
    }
  },
  components: {
    UiIconButton,
    UiSelect,
    UiTextbox
  }
};

</script>