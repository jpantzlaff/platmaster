<template>
  <UiModal
    ref="modal"
    size="fullscreen"
    class="document-add"
    :title="project.name + ': Add Document'"
    dismissOn="close-button"
    transition="fade"
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
      <h3
        class="upload-instruction"
        v-if="project.documents.length < 1"
        style="margin: 0"
      >
        This project doesn't have any documents added to it yet.
      </h3>
      <h3 class="upload-instruction">Choose a document to georeference.</h3>
      <UiFileupload
        name="document"
        accept="image/jpeg,image/png"
        size="large"
        label="Select File"
        @change="handleFile"
      />
    </div>
    <Coordinate
      ref="tie1"
      identity="start"
      @complete="setTie"
    />
    <Coordinate
      v-if="project.bearingBasis === 'None'"
      ref="tie2"
      identity="end"
      @complete="setTie"
    />
    <DirectionDistance
      ref="dd"
      @complete="setDD"
    />
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
    padding: 1rem 8rem;
    position: absolute;
    width: 100%;
  }
  .georef-instruction > h3 {
    background-color: var(--text-color);
    border-radius: 4px;
    color: var(--color1) !important;
    opacity: 0.95;
    padding: 0.5em 1em;
    text-align: center;
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
import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import {getCenter} from 'ol/extent';
import ImageLayer from 'ol/layer/Image';
import Map from 'ol/Map';
import Projection from 'ol/proj/Projection';
import Raster from 'ol/source/Raster';
import Static from 'ol/source/ImageStatic';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';

import Coordinate from './Coordinate';
import CRS from '../crs.js';
import DirectionDistance from './DirectionDistance';
import Document from '../Document.js';
import {db, state} from '../main.js';
import Overlay from 'ol/Overlay';
import Project from '../Project.js';
import ProjectTemplate from '../ProjectTemplate.js';
import {formatDate, styleLineSegment} from '../viz.js';

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
      if (this.stage === 0) {
        return `Draw a line that is coincident with one of the lines on the document. The line must start ${this.project.bearingBasis !== 'None' ? 'at a point' : 'and end at points'} with known geographic coordinates.`;
      } else if (this.stage === 1) {
        return 'Provide the geographic coordinates at the start of the line.';
      } else if (this.stage === 2) {
        return 'Provide the direction and distance of the line, as indicated on the document.';
      } else {
        return 'Provide the geographic coordinates at the end of the line.';
      }
      // If bearing basis is CRS, true north, or magnetic north:
      // draw a line, collecting the start point XY,
      // line direction, and line distance

      // If bearing basis is none, draw a line, collecting both
      // start XY and end XY, line direction, and line distance
    }
  },
  data() {
    return {
      document: null,
      draw: null,
      end: null,
      file: null,
      line: null,
      midpoint: null,
      objectUrl: null,
      ol: null,
      project: state.project,
      stage: 0,
      start: null
    };
  },
  methods: {
    completeDrawing(event) {
      this.line = event.feature.getGeometry();
      this.start = this.line.getFirstCoordinate();
      this.midpoint = this.line.getCoordinateAt(0.5);
      this.end = this.line.getLastCoordinate();
      this.ol.removeInteraction(this.draw);
      this.stage = 1;
      this.ol.addOverlay(
        new Overlay({
          element: this.$refs.tie1.$el,
          offset: [20, -40],
          position: this.start
        })
      );
    },
    close() {
      this.$emit('close');
    },
    async handleFile(files) {
      this.document = new Document();
      const file = files[0];
      this.file = file;
      this.document.buffer = await file.arrayBuffer();
      this.objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = this.objectUrl;
      await image.decode();
      const {height, width} = image;
      const bounds = [0, 0, width, height];
      const docProj = new Projection({
        code: 'doc',
        units: 'pixels',
        extent: bounds
      });
      const view = new View({
        extent: bounds,
        projection: docProj,
        center: getCenter(bounds),
        zoom: 0,
        minZoom: -100,
        maxZoom: 10,
        enableRotation: false
      });
      const lineSource = new VectorSource();
      const lineLayer = new VectorLayer({
        source: lineSource,
        style: styleLineSegment
      });
      const docSource = new Static({
        url: this.objectUrl,
        projection: docProj,
        imageExtent: bounds
      });
      let docLayer;
      if (state.appearance.darkEditor) {
        const docRaster = new Raster({
          sources: [docSource],
          operation: function(pixels) {
            const px = pixels[0];
            px[0] = Math.abs(px[0] - 255);
            px[1] = Math.abs(px[1] - 255);
            px[2] = Math.abs(px[2] - 255);
            return px;
          }
        });
        docLayer = new ImageLayer({source: docRaster});
      } else {
        docLayer = new ImageLayer({source: docSource});
      }
      this.ol = new Map({
        layers: [docLayer, lineLayer],
        target: this.$refs.map,
        view
      });
      view.fit(bounds);
      view.setMinZoom(view.getZoom());
      this.draw = new Draw({
        source: lineSource,
        type: 'LineString',
        maxPoints: 2
      });
      this.ol.addInteraction(this.draw);
      this.draw.on('drawend', this.completeDrawing);
    },
    setDD(data) {
      const {direction, distance} = data;
      if (this.project.bearingBasis === 'None') {
        this.ol.addOverlay(
          new Overlay({
            element: this.$refs.tie2.$el,
            offset: [20, -40],
            position: this.end
          })
        );
      } else {
        const dest = this.project.crs.destination(this.document.tie1.document, direction, distance);
        this.document.tie2 = {
          pixel: this.end,
          source: dest,
          wgs84: this.project.crs.toWgs84(dest)
        };
      }
    },
    setTie(data) {
      console.log(data);
      const {crs, identity, x, y} = data;
      const target = ('identity' === 'start') ? this.document.tie1 : this.document.tie2;
      target.document = (this.project.bearingBasis === 'None' || crs.code === this.project.documentCrs.code)
        ? [x, y]
        : crs.project(this.project.documentCrs, [x, y]);
      target.pixel = this[identity];
      target.wgs84 = crs.toWgs84([x, y]);
      console.log(this.document);
    }
  },
  watch: {
    'document.tie1': async function(value) {
      if (!value.wgs84.length) return;
      if (!this.project.crs) {
        const [lon, lat] = value.wgs84;
        this.project.crs = CRS.newAeqd(lat, lon, this.project.unit);
        if (this.project.bearingBasis === 'Magnetic north') {
          this.project.crs.offset = await CRS.getMagDecl([lon, lat], this.project.bearingBasisDate);
        } else if (this.project.bearingBasis === 'Grid') {
          this.project.crs.offset = this.project.documentCrs.gridConvergence(...value.source);
        }
      }
      this.stage = 2;
      this.ol.addOverlay(
        new Overlay({
          element: this.$refs.dd.$el,
          offset: [20, -40],
          position: this.midpoint
        })
      );
    },
    'document.tie2': function(value) {
      if (!value.wgs84.length) return;
    }
  },
  components: {
    Coordinate,
    DirectionDistance,
    UiFileupload,
    UiModal
  }
};

</script>