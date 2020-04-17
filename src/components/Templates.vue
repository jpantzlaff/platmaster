<template>
  <div id="templates">
    <div class="templates-actions">
      <UiButton
        size="large"
        icon="playlist_add"
        class="welcome-tile"
        v-on:click="newTemplate"
      >
        New Template
      </UiButton>
    </div>
    <div class="template-tiles">
      <div class="no-templates" v-if="templates.length < 1">
        <h3 class="no-templates-text">No project templates have been created yet.</h3>
      </div>
      <template v-for="template in state.templates">
        <div
          :key="template.id"
          class="template-tile"
        >
          <p class="template-name">{{template.name}}</p>
          <p class="template-date">{{formatDate(template.lastModified)}}&ensp;{{formatTime(template.lastModified)}}</p>
          <div class="template-actions">
            <UiFab
              class="template-action"
              icon="edit"
              size="small"
            />
            <UiFab
              class="template-action"
              icon="delete"
              size="small"
            />
          </div>
        </div>
      </template>
    </div>
    <ProjectCreate
      ref="projectCreate"
      :project="currentTemplate"
    />
  </div>
</template>

<style scoped>
  .no-templates {
    align-items: center;
    justify-content: center;
    display: flex;
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
  .template-date {
    color: var(--light-text-color);
  }
  .template-tiles {
    flex: 1 1 auto;
  }
</style>

<script>

import {
  UiButton,
  UiFab
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {state} from '../main.js';
// import Project from '../Project.js';
import ProjectCreate from './ProjectCreate';
import ProjectTemplate from '../ProjectTemplate.js';
import {formatDate, formatTime} from '../viz.js';

export default {
  name: 'Welcome',
  data() {
    return {
      state,
      currentTemplate: {}
    };
  },
  methods: {
    close() {
      this.$data.activeView = 'welcome';
      this.$data.header = null;
    },
    formatDate,
    formatTime,
    newTemplate() {
      const template = new ProjectTemplate();
      state.templates.push(template);
      this.$data.currentTemplate = template;
      this.$refs.projectCreate.open();
    }
  },
  components: {
    ProjectCreate,
    UiButton
  }
};

</script>
