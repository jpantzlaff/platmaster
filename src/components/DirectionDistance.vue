<template>
  <div
    class="dd"
    v-on:keyup.enter="confirm"
  >
    <UiTextbox
      v-model="directionRaw"
      class="direction"
      ref="direction"
      placeholder="Direction"
    />
    <p class="xy-label">Y:</p>
    <UiTextbox
      v-model="distanceRaw"
      class="distance"
      ref="distance"
      placeholder="Distance"
    />
    <UiIconButton
      class="confirm"
      icon="check"
      :disabled="!valid"
      v-on:click="confirm"
    />
  </div>
</template>

<style scoped>
  .dd {
    align-items: center;
    background-color: var(--color2);
    border: 0.5px solid var(--light-text-color);
    display: flex;
    padding: 0 0.5rem;
    position: absolute;
    width: 15rem;
    z-index: 10000;
  }
  .dd > * {
    flex: 0 0 auto;
  }
</style>
<style>
  .dd input {
    text-align: right;
    text-overflow: ellipsis;
  }
</style>

<script>

import {
  UiIconButton,
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {state} from '../main.js';
import {parseDirection, parseDistance} from '../viz.js';

export default {
  name: 'DirectionDistance',
  computed: {
    valid() {
      return Boolean(this.directionValid && this.distanceValid);
    },
    directionValid() {
      return Number.isFinite(this.direction);
    },
    distanceValid() {
      return Number.isFinite(this.distance);
    }
  },
  data() {
    return {
      direction: null,
      distance: null,
      directionRaw: null,
      distanceRaw: null
    };
  },
  methods: {
    confirm() {
      if (this.valid) {
        this.$emit('complete', {
          direction: this.direction,
          distance: this.distance
        });
      }
    }
  },
  watch: {
    directionRaw(value) {
      try {
        this.direction = parseDirection(value);
      } catch {
        this.direction = null;
      }
    },
    distanceRaw(value) {
      try {
        this.distance = parseDistance(value);
      } catch {
        this.distance = null;
      }
    }
  },
  components: {
    UiIconButton,
    UiTextbox
  }
};

</script>