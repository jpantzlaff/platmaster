<template>
  <div class="viewer">
    <div
      class="map"
      ref="leaflet"
      :style="{cursor: mapCursor}"
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
    box-shadow: 0 1px 5px rgba(0,0,0,0.65);
    display: flex;
    justify-content: space-between;
    left: 2rem;
    padding: 0.3rem;
    position: absolute;
    z-index: 1000;
  }
</style>
<style>
  .point-symbol {
    align-items: center !important;
    background-color: var(--color2) !important;
    border: 0.15rem solid var(--text-color) !important;
    border-radius: 0.75rem !important;
    color: var(--text-color) !important;
    display: flex !important;
    font-size: 1.25rem !important;
    font-weight: bold !important;
    height: 1.5rem !important;
    justify-content: center !important;
    margin-left: -0.75rem !important;
    margin-top: -0.75rem !important;
    min-width: 1.5rem !important;
    padding: 0 0.2rem !important;
    width: auto !important;
  }
</style>

<script>

import {
  UiIconButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {state} from '../main.js';
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
    this.map.on('click', this.addPoint);
    this.handlePage();
  },
  computed: {
    mapCursor() {
      return (this.state.activePoint) ? 'crosshair' : 'grab';
    }
  },
  data() {
    return {
      state,
      layer: null,
      map: null
    };
  },
  methods: {
    addPoint(event) {
      if (state.activePoint) {
        const marker = L.marker(event.latlng, {
          draggable: true,
          icon: L.divIcon({
            className: 'point-symbol',
            html: String(state.activePoint.id)
          }),
          keyboard: false
        }).addTo(this.map);
        state.activePage.points.push({
          marker,
          point: state.activePoint
        });
        state.activePoint = null;
      }
    },
    backward() {
      state.activePage = state.pages[state.activePage.id - 1];
    },
    forward() {
      state.activePage = state.pages[state.activePage.id + 1];
    },
    async handlePage() {
      state.activePoint = null;
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