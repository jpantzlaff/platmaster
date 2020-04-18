<template>
  <div id="projects">
    <div class="no-projects" v-if="state.projects.length < 1">
      <h3 class="no-projects-text">No projects have been created.</h3>
      <UiButton
        size="large"
        icon="arrow_back"
        v-on:click="close"
      >
        Back
      </UiButton>
    </div>
    <div class="project-tiles">
      <template v-for="project in state.projects">
        <div
          :key="project.id"
          class="project-tile-holder"
        >
          <div class="project-tile">
            <p class="project-name">{{project.name}}</p>
            <p class="project-date">{{formatDate(project.lastModified)}}&ensp;{{formatTime(project.lastModified)}}</p>
            <div class="project-actions">
              <UiIconButton
                class="project-action"
                icon="launch"
                size="small"
                v-on:click="openProject(project)"
              />
              <UiIconButton
                class="project-action"
                icon="delete"
                size="small"
                v-on:click="deleteProject(project)"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
  .no-projects {
    align-items: center;
    justify-content: center;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    height: 100%;
  }
  .no-projects-text {
    letter-spacing: 0.03em;
  }
  #projects {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem;
    width: 100%;
  }
  .project-action:not(:first-child) {
    margin-left: 1em;
  }
  .project-actions {
    display: flex;
    flex: 1 0 auto;
    justify-content: flex-end;
  }
  .project-name, .project-date {
    margin-bottom: 0;
    margin-top: 0;
  }
  .project-date {
    color: var(--light-text-color) !important;
    font-size: 90%;
    margin-right: 3em;
  }
  .project-name {
    margin-right: 2em;
  }
  .project-tile-holder {
    flex: 0 0 50%;
    padding: 0.5rem;
  }
  .project-tile {
    align-items: center;
    background-color: var(--color2);
    display: flex;
    padding: 0.5em 1em;
  }
  .project-tiles {
    display: flex;
    flex: 0 1 auto;
    flex-wrap: wrap;
    margin: 0 -0.5rem;
    overflow-y: auto;
  }
</style>

<script>

import {
  UiButton,
  UiIconButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {db, state} from '../main.js';
import {formatDate, formatTime} from '../viz.js';

export default {
  name: 'Projects',
  data() {
    return {
      state
    };
  },
  methods: {
    close() {
      state.header = null;
      state.activeView = 'welcome';
    },
    formatDate,
    formatTime,
    deleteProject(project) {
      const index = state.projects.indexOf(project);
      state.projects.splice(index, 1);
      db.delete('projects', 'id', project.id);
    },
    openProject(project) {
      state.project = project;
      state.header = project.name;
      state.activeView = 'editor';
    }
  },
  components: {
    UiButton,
    UiIconButton
  }
};

</script>
