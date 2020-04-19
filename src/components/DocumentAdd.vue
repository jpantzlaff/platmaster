<template>
  <UiModal
    ref="modal"
    size="fullscreen"
    class="document-add"
    :title="project.name + ': Add Document'"
    dismissOn="close-button"
    @hide="close"
  >
    <div
      class="georef"
      v-if="file"
    >
      <div class="map-parent">
        <div class="georef-instruction">
          <h3>{{georefInstruction}}</h3>
        </div>
        <div class="map" ref="map"></div>
      </div>
    </div>
    <div class="upload" v-else>
      <h3 class="upload-instruction">Choose a document to georeference.</h3>
      <UiFileupload
        name="document"
        accept="image/jpeg,image/png"
        size="large"
        label="Select File"
        @change="handleFile"
      />
    </div>
    <!-- <UiButton
      class="continue"
      v-if="!edit && isValid"
      size="large"
      icon="library_add"
      v-on:click="createProject"
      :loading="continuing"
    >
      Create
    </UiButton> -->
  </UiModal>
</template>

<style scoped>
  .continue {
    margin-top: 1rem;
  }
  .georef {
    align-items: center;
    background-color: var(--editor-color);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .georef-instruction {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    height: 100%;
    padding: 1.5rem;
    position: absolute;
    width: 100%;
  }
  .georef-instruction > h3 {
    background-color: var(--text-color);
    border-radius: 4px;
    color: var(--color1) !important;
    opacity: 0.95;
    padding: 0.5em 1em;
    z-index: 10000;
  }
  .map-parent {
    display: block;
    flex: 1 1 auto;
    height: 0;
    width: 100%;
  }
  .map {
    background-color: transparent;
    cursor: crosshair;
    height: 100%;
    width: 100%;
  }
  .upload {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  }
</style>
<style>
  .document-add .ui-modal__body {
    padding: 0 !important;
  }
</style>

<script>

import {
  UiButton,
  UiFileupload,
  UiModal
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import CRS from '../crs.js';
import {db, state} from '../main.js';
import Project from '../Project.js';
import ProjectTemplate from '../ProjectTemplate.js';
import {formatDate} from '../viz.js';

export default {
  name: 'DocumentAdd',
  mounted() {
    this.$refs.modal.open();
  },
  destroyed() {
    URL.revokeObjectURL(this.objectUrl);
  },
  props: {
  },
  computed: {
    georefInstruction() {
      if (false) {
        return '';
      } else {
        return 'Click a point on the document where the geographic position is known.';
      }
    }
  },
  data() {
    return {
      buffer: null,
      file: null,
      image: null,
      leaflet: null,
      objectUrl: null,
      project: state.project
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async handleFile(files) {
      const file = files[0];
      this.file = file;
      this.objectUrl = URL.createObjectURL(file);
      this.image = new Image();
      this.image.src = this.objectUrl;
      await this.image.decode();
      const {height, width} = this.image;
      const bounds = [[0, 0], [height, width]];
      this.leaflet = Leaflet
        .map(this.$refs.map, {
          center: [height / 2, width / 2],
          crs: Leaflet.CRS.Simple,
          minZoom: -100,
          zoom: -1,
          zoomSnap: 0
        })
        .fitBounds(bounds, {
          animate: false,
          duration: 0,
          easeLinearity: 1,
          noMoveStart: true
        })
        .setMaxBounds(bounds);
      const layer = Leaflet.imageOverlay(this.objectUrl, bounds);
      this.leaflet.addLayer(layer);
      if (state.appearance.darkEditor) {
        layer.getElement().style.setProperty('filter', 'invert(1)');
      }
      this.leaflet.setMinZoom(this.leaflet.getZoom());
    }
  },
  watch: {
  },
  components: {
    UiButton,
    UiFileupload,
    UiModal
  }
};

</script>