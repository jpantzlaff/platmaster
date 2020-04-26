<template>
  <div class="document-form">
    <div class="file-drop">
      <div v-if="form.previewUrl" class="preview">
        <img class="preview-image" :src="form.previewUrl">
      </div>
      <UiFileupload
        v-model="form.files"
        accept="image/jpeg,image/png"
        :multiple="true"
        name="image_files"
      />
    </div>
    <div class="form">
      <UiTextbox
        v-model="form.name"
        label="Name"
        error="A name must be provided."
        :invalid="!nameValid"
      />
      <UiSelect
        v-model="form.distanceUnit"
        label="Unit of distance"
        :options="distanceUnits"
      />
      <UiSelect
        v-model="form.bearingBasisType"
        label="Basis of bearings"
        :options="['Grid', 'True/geodetic north', 'Magnetic north']"
      />
      <UiSelect
        v-if="form.bearingBasisType === 'Grid'"
        v-model="form.crs"
        label="Coordinate reference system of the grid"
        placeholder="Search a projection name, location, or SRID code"
        :disableFilter="true"
        :hasSearch="true"
        :loading="crsLoading"
        :no-results="crsNoResult"
        :options="crsOptions"
        @query-change="crsQuery"
        error="A coordinate reference system must be specified."
        :invalid="!crsValid"
      />
      <UiDatepicker
        v-if="form.bearingBasisType === 'Magnetic north'"
        v-model="form.bearingBasisDate"
        :customFormatter="formatDate"
        label="Date of survey (approximate)"
        error="A date must be provided."
        :invalid="!dateValid"
        :appendDropdownToBody="true"
        :yearRange="magDeclinationYears"
        orientation="landscape"
      />
      <UiButton
        class="submit"
        :disabled="!isValid"
        size="large"
        icon="library_add"
        v-on:click="submitForm"
      >
        <UiTooltip :openDelay="300">{{submitTooltip}}</UiTooltip>
        Start
      </UiButton>
    </div>
  </div>
</template>

<style scoped>
  .document-form {
    display: flex;
    height: 100%;
    padding: 1rem;
    width: 100%;
  }
  .file-drop, .form {
    display: flex;
    flex: 1 0 50%;
    flex-direction: column;
    justify-content: center;
    max-width: 50%;
    padding: 2rem;
  }
  .file-drop {
    align-items: center;
  }
  .file-drop > .ui-fileupload {
    display: flex;
    padding: 1.5rem;
  }
  .form {
    overflow: hidden;
  }
  .preview {
    display: flex;
    flex: 1 1 auto;
    padding-bottom: 1rem;
  }
  .preview-image {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
  .submit {
    margin-top: 0.5rem;
  }
</style>
<style>
  .submit > .ui-button__content {
    width: 100%;
  }
</style>

<script>

import {
  UiButton,
  UiDatepicker,
  UiFileupload,
  UiSelect,
  UiTextbox,
  UiTooltip
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {distanceUnits, magDeclinationYears} from '../env.js';
import {state} from '../main.js';
import Page from '../Page.js';
import {queryProj} from '../util.js';
import {formatDate} from '../viz.js';

export default {
  name: 'DocumentForm',
  computed: {
    crsValid() {
      if (this.form.bearingBasisType === 'Grid') {
        const keys = Object.keys(this.form.crs);
        return (keys.includes('label') && keys.includes('value'));
      } else {
        return true;
      }
    },
    dateValid() {
      if (this.form.bearingBasisType === 'Magnetic north') {
        return (this.form.bearingBasisDate instanceof Date);
      } else {
        return true;
      }
    },
    filesValid() {
      return (this.form.files.length > 0);
    },
    isValid() {
      return (this.crsValid && this.dateValid && this.nameValid && this.filesValid);
    },
    nameValid() {
      return (this.form.name.length > 0);
    },
    submitTooltip() {
      if (!this.filesValid) {
        return 'Select file(s) to georeference.';
      } else if (!this.crsValid) {
        return 'Provide the coordinate reference system used in the document.';
      } else if (!this.dateValid) {
        return 'Provide an approximate date of survey.';
      } else if (!this.nameValid) {
        return 'Provide a name.';
      } else {
        return `Proceed to georeference the selected file${(this.form.files.length > 0) ? 's' : ''}.`;
      }
    }
  },
  data() {
    return {
      crsLoading: false,
      crsNoResult: false,
      crsOptions: [],
      distanceUnits,
      form: state.form,
      magDeclinationYears
    };
  },
  methods: {
    async crsQuery(term) {
      this.crsLoading = true;
      queryProj(term)
        .then((results) => {
          this.crsNoResult = false;
          this.crsOptions = results.map((r) => {
            return {
              label: `SRID:${r.code} – ${r.name}`,
              value: r
            };
          });
        })
        .catch(() => this.crsNoResult = true)
        .finally(() => this.crsLoading = false);
    },
    formatDate,
    submitForm() {
      state.pages = Array.from(this.form.files).map((file, id) => {
        return new Page({
          file,
          id
        });
      });
      state.activePage = state.pages[0];
    }
  },
  watch: {
    'form.bearingBasisType': function(value) {
      if (value !== 'Magnetic north') {
        this.form.bearingBasisDate = null;
      }
    },
    'form.files': function(value) {
      if (this.form.previewUrl) {
        URL.revokeObjectURL(this.form.previewUrl);
      }
      if (value[0]) {
        const file = value[0];
        this.form.previewUrl = URL.createObjectURL(file);
        if (this.form.name === 'Untitled') {
          this.form.name = file.name.split('.')[0];
        }
      }
    }
  },
  components: {
    UiButton,
    UiDatepicker,
    UiFileupload,
    UiSelect,
    UiTextbox,
    UiTooltip
  }
};

</script>