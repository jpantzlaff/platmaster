<template>
  <div
    class="point"
    v-on:click="placePoint"
  >
    <div class="point-bar">
      <div class="point-id-badge">
        <p class="point-id">{{point.id}}</p>
      </div>
      <UiIconButton
        class="relative-point"
        icon="timeline"
        :tooltip="newPointTooltip"
        :disabled="!newPointsAllowed"
        v-on:click="newRelativePoint"
      />
    </div>
    <div
      class="point-data"
      :style="{cursor: xyPointer}"
    >
      <UiTooltip :openDelay="750">{{tooltipContent}}</UiTooltip>
      <div class="point-xy">
        <p class="point-x">{{point.nativeX}}</p>
        <p class="point-sep">,</p>
        <p class="point-y">{{point.nativeY}}</p>
      </div>
      <p class="point-crs">{{point.nativeCrs.name}}</p>
    </div>
  </div>
</template>

<style scoped>
  .point {
    background-color: var(--color1);
    border: 1.5px solid var(--color1);
    border-radius: 0.125rem;
    display: flex;
    height: 4.5rem;
    margin-bottom: 0.75rem;
  }
  .point-bar {
    border: 1.5px solid var(--color1);
    display: flex;
    flex: 0 0 2.25rem;
    flex-direction: column;
  }
  .point-data {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    padding: 0 0.5rem 0.1rem 0.5em;
  }
  .point-crs {
    color: var(--light-text-color) !important;
    flex: 0 1 auto;
    font-size: 85%;
    line-height: 1.25;
    margin: 0;
    max-height: 2rem;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }
  .point-id {
    font-weight: bold;
    margin: 0;
  }
  .point-id-badge {
    align-items: center;
    background-color: var(--color2);
    border-bottom: 1.5px solid var(--color1);
    display: flex;
    justify-content: center;
  }
  .point-id-badge, .relative-point {
    flex: 0 0 50%;
  }
  .relative-point {
    border-radius: 0;
    width: 100%;
  }
  .point-xy {
    display: flex;
    flex: 0 0 auto;
    justify-content: flex-end;
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
  UiIconButton,
  UiTooltip
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
        : 'No more than two points can exist for every page.';
    },
    newPointsAllowed() {
      if (this.state.pendingPoint) return false;
      return this.state.points.length < (this.state.pages.length * 2);
    },
    pageHasThisPoint() {
      return this.state.activePage.points.some((p) => p.point === this.point);
    },
    placePointsAllowed() {
      return (this.state.activePage.points.length < 2);
    },
    tooltipContent() {
      if (this.pageHasThisPoint) {
        return 'This point has already been added to the page.';
      } else if (!this.placePointsAllowed) {
        return 'No more points can be added to the page.';
      } else {
        return 'Click to add this point to the page.';
      }
    },
    xyPointer() {
      return (this.pageHasThisPoint || !this.placePointsAllowed) ? 'not-allowed' : 'pointer';
    }
  },
  data() {
    return {state};
  },
  methods: {
    newRelativePoint() {
      this.state.pendingPoint = {
        crs: {},
        origin: this.point,
        type: 'relative',
        x: null,
        y: null
      };
    },
    placePoint() {
      if (this.placePointsAllowed && !this.pageHasThisPoint) {
        state.activePoint = this.point;
      }
    }
  },
  components: {
    UiIconButton,
    UiTooltip
  }
};

</script>