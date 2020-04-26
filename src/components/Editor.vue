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
        <RelativePointForm
          v-if="state.pendingPoint && state.pendingPoint.type === 'relative'"
        ></RelativePointForm>
        <UiButton
          class="point-add"
          icon="add"
          tooltip="Create a new point from coordinates."
          v-if="newPointsAllowed"
          v-on:click="newAbsolutePoint"
        >
          Add Point
        </UiButton>
      </div>
      <div class="control-buttons">
        <UiButton
          class="export"
          icon="save_alt"
          size="large"
          :disabled="!exportAllowed"
          v-on:click="exportPages"
        >
          <UiTooltip :openDelay="1000">{{exportTooltip}}</UiTooltip>
          Export
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .control-buttons {
    padding-right: 0.3rem;
    padding-top: 1.5rem;
  }
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
  .export {
    background-color: var(--color1) !important;
    width: 100%;
  }
  .point-add {
    background-color: var(--color1) !important;
    width: 100%;
  }
  .points {
    height: 100%;
    overflow-y: auto;
    padding-right: 0.3rem;
    scrollbar-width: thin;
  }
  .view {
    background-color: black;
    flex: 1 1 auto;
  }
</style>
<style>
  .export > .ui-button__content {
    width: 100%;
  }
</style>

<script>

import {
  UiButton,
  UiTooltip
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import proj4 from 'proj4';
import {getMagDecl, gridConvergence} from '../util.js';

import AbsolutePointForm from './AbsolutePointForm';
import exportPages from '../export.js';
import FixedPoint from './FixedPoint';
import {state} from '../main.js';
import RelativePointForm from './RelativePointForm';
import Viewer from './Viewer';

export default {
  name: 'Editor',
  mounted() {
    if (this.state.points.length === 0 && !this.state.pendingPoint) {
      this.state.pendingPoint = {
        crs: {},
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
    exportTooltip() {
      return (this.exportAllowed)
        ? 'Save the pages as georeferenced files.'
        : 'Two points must be added to every page before exporting.';
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
    exportPages,
    newAbsolutePoint() {
      this.state.pendingPoint = {
        crs: {},
        type: 'absolute',
        x: null,
        y: null
      };
    }
  },
  watch: {
    'state.points': async function(value) {
      if (!state.localCrs.proj4 && state.points[0]) {
        const point = state.points[0];
        point.localX = 0;
        point.localY = 0;
        const [lon, lat] = proj4(point.nativeCrs.proj4).inverse([point.nativeX, point.nativeY]);
        const unit = state.form.distanceUnit.value;
        state.localCrs.proj4 = `+proj=aeqd +lat_0=${lat} +lon_0=${lon} +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=${unit} +no_defs`;
        const basis = state.form.bearingBasisType;
        if (basis === 'Magnetic north') {
          try {
            state.localCrs.offset = await getMagDecl([lon, lat], state.form.bearingBasisDate);
            console.log(state.localCrs.offset);
          } catch(error) {
            console.error(error);
          }
        } else if (basis === 'Grid') {
          try {
            const [x, y] = proj4(state.form.crs.value.proj4, [lon, lat]);
            state.localCrs.offset = gridConvergence(state.form.crs.value, x, y);
            console.log(state.localCrs.offset);
          } catch(error) {
            console.error(error);
          }
        }
      }
    }
  },
  components: {
    AbsolutePointForm,
    FixedPoint,
    RelativePointForm,
    UiButton,
    UiTooltip,
    Viewer
  }
};

</script>
