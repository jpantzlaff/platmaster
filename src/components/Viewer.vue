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
        icon="arrow_back_ios"
        size="mini"
        tooltip="View previous page"
        :disabled="state.activePage.id <= 1"
        v-on:click="backward"
      />
      <p class="page-number">{{state.activePage.id}}</p>
      <UiIconButton
        class="advance"
        icon="arrow_forward_ios"
        size="mini"
        tooltip="View next page"
        :disabled="state.activePage.id >= state.pages.length"
        v-on:click="forward"
      />
    </div>
  </div>
</template>

<style scoped>
  .map {
    background-color: black;
    height: 100%;
    width: 100%;
  }
  .switcher {
    bottom: 2rem;
    display: flex;
    left: 2rem;
    position: absolute;
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
    console.log(this.$refs);
    this.map = L.map(this.$refs.leaflet, {
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

    },
    forward() {

    },
    async handlePage() {
      const page = state.activePage;
      const {height, width} = await page.size;
      if (this.layer) {
        this.layer.remove();
      }
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