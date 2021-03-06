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
          v-on:click="runExport"
        >
          <UiTooltip :openDelay="1000">{{exportTooltip}}</UiTooltip>
          Export
        </UiButton>
      </div>
      <UiModal
        ref="exporting"
        class="exporting"
        :dismissible="false"
        transition="fade"
        size="auto"
        :removeHeader="true"
      >
        <div
          v-if="!state.exportComplete"
          class="progress"
        >
          <UiProgressCircular />
          <h2 class="exporting-text">Exporting...</h2>
        </div>
        <div
          v-else
          class="conclusion"
        >
          <h2 class="complete-text">Export complete</h2>
          <UiButton
            icon="replay"
            v-on:click="reload"
          >
            Start Over
          </UiButton>
        </div>
      </UiModal>
    </div>
  </div>
</template>

<style scoped>
  .conclusion {
    display: flex;
    flex-direction: column;
    margin-bottom: -0.4rem;
  }
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
  .complete-text {
    margin: 0 0 1rem 0;
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
  .exporting-text {
    margin: 0 0 0 1rem;
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
  .progress {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: -0.5rem;
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
  UiModal,
  UiProgressCircular,
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
    newAbsolutePoint() {
      this.state.pendingPoint = {
        crs: {},
        type: 'absolute',
        x: null,
        y: null
      };
    },
    reload() {
      window.location.reload();
    },
    runExport() {
      this.$refs.exporting.open();
      exportPages();
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
        state.localCrs.proj4 = [
          `PROJCS["${state.form.name}"`,
          'GEOGCS["GCS_WGS_1984"',
          'DATUM["WGS_1984"',
          'SPHEROID["WGS_1984",6378137,298.257223563]]',
          'PRIMEM["Greenwich",0]',
          'UNIT["Degree",0.017453292519943295]]',
          'PROJECTION["Azimuthal_Equidistant"]',
          'PARAMETER["False_Easting",0]',
          'PARAMETER["False_Northing",0]',
          `PARAMETER["Central_Meridian",${lon}]`,
          `PARAMETER["Latitude_Of_Origin",${lat}]`,
          `UNIT["${unit.abbr}",${unit.factor}]]`
        ].join(',');
        const basis = state.form.bearingBasisType;
        if (basis === 'Magnetic north') {
          try {
            state.localCrs.offset = await getMagDecl([lon, lat], state.form.bearingBasisDate);
          } catch(error) {
            console.error(error);
          }
        } else if (basis === 'Grid') {
          try {
            const [x, y] = proj4(state.form.crs.value.proj4, [lon, lat]);
            state.localCrs.offset = gridConvergence(state.form.crs.value, x, y);
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
    UiModal,
    UiProgressCircular,
    UiTooltip,
    Viewer
  }
};

</script>
