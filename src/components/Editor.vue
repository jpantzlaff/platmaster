<template>
  <div class="editor">
    <Viewer class="view" />
    <div class="controls">
      <div class="points">
        <template v-for="point in state.points">
          <FixedPoint
            :key="point.id"
            :point="point"
          />
        </template>
        <AbsolutePointForm
          v-if="pendingPoint && pendingPoint.type === 'absolute'"
        ></AbsolutePointForm>
        <!-- <RelativePointForm
          v-if="pendingPoint && pendingPoint.type === 'relative'"
        ></RelativePointForm> -->
        <UiButton
          class="point-add"
          icon="add"
          v-if="newPointsAllowed"
          v-on:click="newAbsolutePoint"
        >
          Add Point
        </UiButton>
      </div>
      <div class="control-buttons">
        <UiButton
          class="export"
          icon="save-alt"
          v-if="exportAllowed"
          v-on:click="exportPages"
        >
          Export
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .controls {
    flex: 0 0 15rem;
  }
  .editor {
    display: flex;
    height: 100%;
    width: 100%;
  }
  .view {
    flex: 1 1 auto;
  }
</style>

<script>

import {
  UiButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import FixedPoint from './FixedPoint';
import {state} from '../main.js';
import Viewer from './Viewer';

export default {
  name: 'Editor',
  mounted() {
    if (this.points.length === 0 && !this.pendingPoint) {
      this.pendingPoint = {
        crs: this.preferredCrs,
        type: 'absolute',
        x: null,
        y: null
      };
    }
  },
  computed: {
    exportAllowed() {
      return this.state.pages.every((page) => page.points.length >= 2);
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
    exportPages() {

    },
    newAbsolutePoint() {

    }
  },
  components: {
    UiButton,
    Viewer
  }
};

</script>
