<template>
  <div
    class="point"
    v-on:click="placePoint"
  >
    <div class="point-head">
      <div class="point-id-badge">
        <p class="point-id">{{point.id}}</p>
      </div>
      <div class="point-xy">
        <p class="point-x">{{point.nativeX}}</p>
        <p class="point-sep">,</p>
        <p class="point-y">{{point.nativeY}}</p>
      </div>
    </div>
    <div class="point-base">
      <UiIconButton
        class="relative-point"
        icon="timeline"
        :tooltip="newPointTooltip"
        :disabled="!newPointsAllowed"
        v-on:click="newRelativePoint"
      />
      <p class="point-crs">{{point.nativeCrs.label}}</p>
    </div>
  </div>
</template>

<style scoped>
  .point {
    background-color: var(--color1);
    border-radius: 0.125rem;
    margin-bottom: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
  .point-base {
    align-items: center;
    display: flex;
  }
  .point-crs {
    color: var(--light-text-color) !important;
  }
  .point-head {
    display: flex;
  }
  .point-id {
    font-weight: bold;
    margin: 0;
  }
  .point-id-badge {
    align-items: center;
    background-color: var(--color2);
    border-radius: 0.75em;
    display: flex;
    flex: 0 0 1.5rem;
    height: 1.5rem;
    justify-content: center;
    width: 1.5rem;
  }
  .point-xy {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    margin-left: 0.3rem;
  }
  .point-x, .point-sep, .point-y {
    margin: 0;
  }
  .point-sep {
    padding-left: 0.1rem;
    padding-right: 0.2rem;
  }
  .point-x, .point-y {
    max-width: 5.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
    newRelativePoint() {},
    placePoint() {
      state.activePoint = this.point;
    }
  },
  components: {
    UiIconButton
  }
};

</script>