<template>
  <div id="templates">
    <div
      class="templates-actions"
      v-if="state.templates.length > 0"
    >
      <UiButton
        size="large"
        icon="playlist_add"
        v-on:click="newTemplate"
      >
        New Template
      </UiButton>
    </div>
    <div class="no-templates" v-else>
      <h3 class="no-templates-text">No project templates have been created.</h3>
      <UiButton
        size="large"
        icon="playlist_add"
        v-on:click="newTemplate"
      >
        New Template
      </UiButton>
    </div>
    <div class="template-tiles">
      <template v-for="template in state.templates">
        <div
          :key="template.id"
          class="template-tile-holder"
        >
          <div class="template-tile">
            <p class="template-name">{{template.name}}</p>
            <p class="template-date">{{formatDate(template.lastUsed)}}&ensp;{{formatTime(template.lastUsed)}}</p>
            <div class="template-actions">
              <UiIconButton
                class="template-action"
                icon="edit"
                size="small"
                v-on:click="currentTemplate = template; editOpen = true"
              />
              <UiIconButton
                class="template-action"
                icon="delete"
                size="small"
                v-on:click="deleteTemplate(template)"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
    <ProjectCreateEdit
      v-if="editOpen"
      :edit="true"
      :project="currentTemplate"
      @close="editClose"
    />
  </div>
</template>

<style scoped>
  .no-templates {
    align-items: center;
    justify-content: center;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    height: 100%;
  }
  .no-templates-text {
    letter-spacing: 0.03em;
  }
  #templates {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem;
    width: 100%;
  }
  .template-action:not(:first-child) {
    margin-left: 1em;
  }
  .template-actions {
    display: flex;
    flex: 1 0 auto;
    justify-content: flex-end;
  }
  .template-name, .template-date {
    margin-bottom: 0;
    margin-top: 0;
  }
  .template-date {
    color: var(--light-text-color) !important;
    font-size: 90%;
    margin-right: 3em;
  }
  .template-name {
    margin-right: 2em;
  }
  .template-tile-holder {
    flex: 0 0 50%;
    padding: 0.5rem;
  }
  .template-tile {
    align-items: center;
    background-color: var(--color2);
    display: flex;
    padding: 0.5em 1em;
  }
  .template-tiles {
    display: flex;
    flex: 0 1 auto;
    flex-wrap: wrap;
    margin: 0 -0.5rem;
    overflow-y: auto;
  }
  .templates-actions {
    margin-bottom: 1rem;
  }
</style>

<script>

import {
  UiButton,
  UiIconButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {db, state} from '../main.js';
import ProjectCreateEdit from './ProjectCreateEdit';
import ProjectTemplate from '../ProjectTemplate.js';
import {formatDate, formatTime} from '../viz.js';

export default {
  name: 'Templates',
  data() {
    return {
      state,
      currentTemplate: {},
      editOpen: false
    };
  },
  methods: {
    close() {
      state.activeView = 'welcome';
      state.header = null;
    },
    editClose() {
      this.editOpen = false;
      const {
        id,
        bearingBasisDate,
        bearingBasisType,
        crs,
        distanceBasisType,
        distanceUnit,
        lastUsed,
        name
      } = this.currentTemplate;
      db.insert('templates', {
        id,
        bearingBasisDate,
        bearingBasisType,
        crs: {...crs},
        distanceBasisType,
        distanceUnit: {...distanceUnit},
        lastUsed,
        name
      }, true);
    },
    formatDate,
    formatTime,
    deleteTemplate(template) {
      const index = state.templates.indexOf(template);
      state.templates.splice(index, 1);
      db.delete('templates', 'id', template.id);
    },
    newTemplate() {
      const template = new ProjectTemplate();
      state.templates.push(template);
      this.currentTemplate = template;
      this.editOpen = true;
    }
  },
  components: {
    ProjectCreateEdit,
    UiButton,
    UiIconButton
  }
};

</script>
