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
          v-if="state.pendingPoint && state.pendingPoint.type === 'absolute'"
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
    background-color: var(--color2);
    display: flex;
    flex: 0 0 17rem;
    flex-direction: column;
    padding: 0.5rem 0.2rem 0.5rem 0.5rem;
  }
  .editor {
    display: flex;
    height: 100%;
    width: 100%;
  }
  .points {
    height: 100%;
    overflow-y: auto;
    padding-right: 0.3em;
    scrollbar-width: thin;
  }
  .view {
    background-color: black;
    flex: 1 1 auto;
  }
</style>

<script>

import {
  UiButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import AbsolutePointForm from './AbsolutePointForm';
import FixedPoint from './FixedPoint';
import {state} from '../main.js';
import Viewer from './Viewer';

export default {
  name: 'Editor',
  mounted() {
    console.log(this.state.points, this.state.pendingPoint);
    if (this.state.points.length === 0 && !this.state.pendingPoint) {
      this.state.pendingPoint = {
        crs: this.preferredCrs || {},
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
    AbsolutePointForm,
    FixedPoint,
    UiButton,
    Viewer
  }
};

</script>
