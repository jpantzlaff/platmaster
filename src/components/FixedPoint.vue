<template>
  <div
    class="point"
    v-on:click="placePoint"
  >
    <p class="point-x">X: {{point.nativeX}}</p>
    <p class="point-y">Y: {{point.nativeY}}</p>
    <div class="point-base">
      <p class="point-crs">CRS: {{point.nativeCrs.label}}</p>
      <UiIconButton
        class="relative-point"
        icon="timeline"
        :tooltip="newPointTooltip"
        :disabled="!newPointsAllowed"
        v-on:click="newRelativePoint"
      />
    </div>
  </div>
</template>

<style scoped>

</style>

<script>

import {
  UiIconButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {state} from '../main.js';

export default {
  name: 'FixedPoint',
  props: ['point'],
  computed: {
    newPointTooltip() {
      return (this.newPointsAllowed)
        ? 'Create a new point relative to this one.'
        : 'No more points can be placed.';
    },
    newPointsAllowed() {
      if (this.state.pendingPoint) return false;
      return this.state.points.length < (this.state.pages.length * 2);
    }
  },
  data() {
    return {state};
  },
  methods: {
    placePoint() {
      state.activePoint = this.point;
    }
  },
  components: {
    UiIconButton
  }
};

</script>