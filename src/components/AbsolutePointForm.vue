<template>
  <div class="point-form">
    <div class="top">
      <p class="descriptor">New Point</p>
    </div>
    <div class="xy">
      <UiTextbox
        v-model="point.x"
        class="x"
        placeholder="X"
        type="number"
        error="Provide a value."
        :invalid="!xValid"
      />
      <p class="sep">,</p>
      <UiTextbox
        v-model="point.y"
        class="y"
        placeholder="Y"
        type="number"
        error="Provide a value."
        :invalid="!yValid"
      />
    </div>
    <UiSelect
      v-model="point.crs"
      class="crs-select"
      placeholder="Search projection/SRID"
      :disableFilter="true"
      :hasSearch="true"
      :loading="crsLoading"
      :no-results="crsNoResult"
      :options="crsOptions"
      @query-change="crsQuery"
      error="Specify a coordinate system."
      :invalid="!crsValid"
    />
    <div class="bottom">
       <UiButton
        class="submit"
        v-if="isValid"
        size="normal"
        icon="check"
        v-on:click="submitForm"
      >
        Confirm
      </UiButton>
    </div>
  </div>
</template>

<style scoped>
  .top, .bottom {
    align-items: center;
    display: flex;
  }
  .descriptor {
    flex: 1 1 auto;
    font-weight: bold;
    margin: 0;
    text-align: center;
  }
  .point-form {
    background-color: var(--color1);
    border-radius: 0.125rem;
    padding: 0.5rem 0.75rem;
  }
  .sep {
    margin: 0.7em 0 0 0;
  }
  .submit {
    width: 100%;
  }
  .xy {
    display: flex;
  }
  .x {
    padding-right: 0.25rem;
  }
  .y {
    padding-left: 0.25rem;
  }
</style>
<style>
  .crs-select .ui-select__display-value {
    max-height: 2em;
    overflow: hidden;
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
      return Boolean(this.point.crs.value);
    },
    isValid() {
      return (this.crsValid && this.xValid && this.yValid);
    },
    xValid() {
      return Boolean(Number(this.point.x));
    },
    yValid() {
      return Boolean(Number(this.point.y));
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
    submitForm() {
      state.points.push({
        id: state.points.length + 1,
        nativeX: this.point.x,
        nativeY: this.point.y,
        nativeCrs: this.point.crs
      });
      state.pendingPoint = null;
    }
  },
  components: {
    UiButton,
    UiSelect,
    UiTextbox
  }
};

</script>