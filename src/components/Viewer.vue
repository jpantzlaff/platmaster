<template>
  <div class="viewer">
    <div
      class="map"
      ref="leaflet"
    />
    <div
      class="switcher"
      v-if="state.pages.length > 1"
    >
      <UiIconButton
        class="advance"
        icon="keyboard_arrow_left"
        size="mini"
        tooltip="View previous page"
        v-if="state.activePage.id > 0"
        v-on:click="backward"
      />
      <p class="page-indicator">Page {{state.activePage.id + 1}}</p>
      <UiIconButton
        class="advance"
        icon="keyboard_arrow_right"
        size="mini"
        tooltip="View next page"
        v-if="state.activePage.id < state.pages.length - 1"
        v-on:click="forward"
      />
    </div>
  </div>
</template>

<style scoped>
  .map {
    background-color: black;
    border-right: 0.1rem solid black;
    border-top: 0.1rem solid black;
    height: 100%;
    width: 100%;
  }
  .page-indicator {
    margin: 0 0.7rem;
    user-select: none;
    word-spacing: 0.1em;
  }
  .switcher {
    align-items: center;
    background-color: var(--color1);
    border: 0.05rem solid black;
    border-radius: 0.125rem;
    bottom: 2rem;
    display: flex;
    justify-content: space-between;
    left: 2rem;
    padding: 0.3rem;
    position: absolute;
    z-index: 1000;
  }
</style>

<script>

import {
  UiIconButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {distanceUnits, magDeclinationYears} from '../env.js';
import {state} from '../main.js';
import Page from '../Page.js';
import {queryProj} from '../util.js';
import {formatDate} from '../viz.js';

export default {
  name: 'Viewer',
  mounted() {
    this.map = L.map(this.$refs.leaflet, {
      attributionControl: false,
      center: [0, 0],
      crs: L.CRS.Simple,
      maxZoom: 10,
      minZoom: -100,
      zoom: 0,
      zoomDelta: 0.5,
      zoomSnap: 0
    });
    this.handlePage();
  },
  data() {
    return {
      state,
      layer: null,
      map: null
    };
  },
  methods: {
    backward() {
      state.activePage = state.pages[state.activePage.id - 1];
    },
    forward() {
      state.activePage = state.pages[state.activePage.id + 1];
    },
    async handlePage() {
      const page = state.activePage;
      const {height, width} = await page.size;
      if (this.layer) {
        this.layer.remove();
      }
      this.map.setMaxBounds(null);
      this.map.setMinZoom(-100);
      this.layer = L.imageOverlay(
        page.objectUrl,
        [[0, 0], [height, width]],
        {className: 'editor-page'}
      );
      this.map.addLayer(this.layer);
      this.map.fitBounds(this.layer.getBounds(), {
        animate: false,
        duration: 0,
        padding: [50, 50]
      });
      this.map.setMaxBounds(this.map.getBounds());
      this.map.setMinZoom(this.map.getZoom() + 0.01);
    }
  },
  watch: {
    'state.activePage': function() {
      this.handlePage();
    }
  },
  components: {
    UiIconButton
  }
};

</script>