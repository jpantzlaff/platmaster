<template>
  <div class="point-form">
    <div class="top">
      <p class="descriptor">New Point from <span class="id-badge">{{origin.id}}</span></p>
    </div>
    <div class="dd">
      <UiTextbox
        v-model="direction"
        class="direction"
        placeholder="Direction"
        :error='`e.g. "${state.settings.directionFormat}"`'
        :invalid="!directionValid"
      />
      <p class="sep">,</p>
      <UiTextbox
        v-model="distance"
        class="distance"
        placeholder="Distance"
        type="number"
        error='e.g. "1234.56"'
        :invalid="!distanceValid"
      />
    </div>
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
  .dd {
    display: flex;
  }
  .descriptor {
    flex: 1 1 auto;
    font-weight: bold;
    margin: 0;
    text-align: center;
  }
  .direction {
    padding-right: 0.25rem;
  }
  .distance {
    padding-left: 0.25rem;
  }
  .id-badge {
    background-color: var(--color2);
    border-radius: 0.75em;
    display: inline-block;
    height: 1.5em;
    line-height: 1.5;
    margin-left: 0.1em;
    width: 1.5em;
  }
  .top, .bottom {
    align-items: center;
    display: flex;
    justify-content: space-between;
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
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import proj4 from 'proj4';

import {state} from '../main.js';
import {destination, queryProj} from '../util.js';
import {parseDirection} from '../viz.js';

export default {
  name: 'RelativePointForm',
  computed: {
    directionValid() {
      try {
        parseDirection(this.direction);
        return true;
      } catch {
        return false;
      }
    },
    distanceValid() {
      return Number.isFinite(parseFloat(this.distance));
    },
    isValid() {
      return (this.directionValid && this.distanceValid);
    }
  },
  data() {
    return {
      state,
      origin: state.pendingPoint.origin,
      point: state.pendingPoint,
      direction: null,
      distance: null
    };
  },
  methods: {
    submitForm() {
      const [localX, localY] = destination(
        [this.origin.localX, this.origin.localY],
        parseDirection(this.direction),
        this.distance
      );
      const [nativeX, nativeY] = proj4(
        state.localCrs.proj4,
        this.origin.nativeCrs.proj4,
        [localX, localY]
      );
      state.points.push({
        id: state.points.length + 1,
        localX,
        localY,
        nativeCrs: this.origin.nativeCrs,
        nativeX,
        nativeY
      });
      state.pendingPoint = null;
    }
  },
  components: {
    UiButton,
    UiTextbox
  }
};

</script>