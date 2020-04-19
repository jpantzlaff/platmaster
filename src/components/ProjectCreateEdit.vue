<template>
  <UiModal
    ref="modal"
    size="large"
    :title="(edit) ? 'Edit project template' : 'New project'"
    dismissOn="close-button esc"
    @hide="close"
  >
    <div
      class="template-selection"
      v-if="existingTemplates.length > 0"
    >
      <UiSelect
        v-model="existingTemplate"
        placeholder="Use an existing template"
        :options="existingTemplates"
        :disabled="continuing"
      />
    </div>
    <UiTextbox
      v-model="template.name"
      label="Project name"
      error="A name must be provided."
      :disabled="continuing"
      :invalid="!nameValid"
    />
    <UiSelect
      v-model="template.distanceUnit"
      label="Unit of distance"
      :options="template.distanceUnits"
      :disabled="continuing"
    />
    <UiSelect
      v-model="template.distanceBasisType"
      label="Basis of distances"
      :options="['Grid', 'Ground']"
      :disabled="continuing"
    />
    <UiSelect
      v-if="template.distanceBasisType === 'Ground'"
      v-model="template.bearingBasisType"
      label="Basis of bearings"
      :options="['Grid', 'True/geodetic north', 'Magnetic north', 'None']"
      :disabled="continuing"
    />
    <UiSelect
      v-if="template.distanceBasisType === 'Grid' || template.bearingBasisType === 'Grid'"
      v-model="template.crs"
      label="Coordinate reference system of the grid"
      placeholder="Search a projection name, location, or SRID code"
      :disableFilter="true"
      :hasSearch="true"
      :loading="crsLoading"
      :no-results="crsNoResult"
      :options="crsOptions"
      @query-change="crsQuery"
      error="A coordinate reference system must be specified."
      :disabled="continuing"
      :invalid="!crsValid"
    />
    <UiDatepicker
      v-if="template.bearingBasisType === 'Magnetic north'"
      v-model="template.bearingBasisDate"
      :customFormatter="formatDate"
      label="Date of survey (approximate)"
      error="A date must be provided."
      :disabled="continuing"
      :invalid="!dateValid"
    />
    <UiButton
      class="continue"
      v-if="!edit && isValid"
      size="large"
      icon="library_add"
      v-on:click="createProject"
      :loading="continuing"
    >
      Create
    </UiButton>
  </UiModal>
</template>

<style scoped>
  .continue {
    margin-top: 1rem;
  }
  .template-selection {
    margin-bottom: 2rem;
  }
</style>

<script>

import {
  UiButton,
  UiDatepicker,
  UiModal,
  UiSelect,
  UiTextbox
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import CRS from '../crs.js';
import {db, state} from '../main.js';
import Project from '../Project.js';
import ProjectTemplate from '../ProjectTemplate.js';
import {formatDate} from '../viz.js';

export default {
  name: 'ProjectCreateEdit',
  mounted() {
    this.$refs.modal.open();
  },
  props: {
    edit: {
      default: false,
      type: Boolean
    },
    project: {
      default: () => new ProjectTemplate(),
      type: Object
    }
  },
  computed: {
    crsValid() {
      if (this.template.distanceBasisType === 'Grid' || this.template.bearingBasisType === 'Grid') {
        const keys = Object.keys(this.template.crs);
        return (keys.includes('label') && keys.includes('value'));
      } else {
        return true;
      }
    },
    dateValid() {
      if (this.template.bearingBasisType === 'Magnetic north') {
        return (this.template.bearingBasisDate instanceof Date);
      } else {
        return true;
      }
    },
    existingTemplates() {
      if (this.edit) {
        return [];
      } else {
        return state.templates.map((x) => ({
          label: 'Template: ' + x.name,
          value: x
        }));
      }
    },
    isValid() {
      return (this.crsValid && this.dateValid && this.nameValid);
    },
    nameValid() {
      return (this.template.name.length > 0);
    }
  },
  data() {
    return {
      continuing: false,
      crsLoading: false,
      crsNoResult: false,
      crsOptions: [],
      existingTemplate: {},
      template: this.project
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async createProject() {
      this.continuing = true;
      const project = await Project.fromTemplate(this.template);
      state.projects.push(project);
      const {
        id,
        lastModified,
        name
      } = project;
      await db.insert('projects', {
        id,
        lastModified,
        name
      });
      this.$refs.modal.close();
      state.header = name;
      state.activeView = 'editor';
    },
    async crsQuery(term) {
      this.crsLoading = true;
      CRS.queryProj(term)
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
    formatDate
  },
  watch: {
    'template.bearingBasisType': function(value) {
      if (value !== 'Grid' && this.template.distanceBasisType !== 'Grid') {
        this.template.crs = {};
      }
      if (value !== 'Magnetic north') {
        this.template.bearingBasisDate = null;
      }
    },
    'template.distanceBasisType': function(value) {
      if (value === 'Grid') {
        this.template.bearingBasisType = 'Grid';
      } else if (this.template.bearingBasisType !== 'Grid') {
        this.template.crs = {};
      }
    },
    existingTemplate(selected) {
      const {value} = selected;
      for (let prop in value) {
        if (!['distanceUnits', 'id'].includes(prop)) {
          this.template[prop] = value[prop];
        }
      }
    }
  },
  components: {
    UiButton,
    UiDatepicker,
    UiModal,
    UiSelect,
    UiTextbox
  }
};

</script>