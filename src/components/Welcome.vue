<template>
  <div id="welcome">
    <div id="welcome-columns">
      <div class="welcome-column">
        <div class="welcome-group" style="flex: 0 0 auto">
          <h2 class="welcome-group-title">Projects</h2>
          <div class="welcome-tile-group">
            <UiButton
              icon="add"
              class="welcome-tile"
              v-on:click="newProject"
            >
              <div>
                <p>Start new project</p>
              </div>
            </UiButton>
            <UiButton
              icon="folder_open"
              class="welcome-tile"
              v-on:click="openProjects"
            >
              <div>
                <p>Open existing project</p>
              </div>
            </UiButton>
            <UiButton
              icon="playlist_add"
              class="welcome-tile"
              v-on:click="openTemplates">
              <div>
                <p>Manage templates</p>
                <p>Use templates to create new projects more quickly.</p>
              </div>
            </UiButton>
          </div>
        </div>
        <div
          class="welcome-group"
          v-if="state.projects.length"
          style="flex: 1 1 auto; height: 0"
        >
          <h3
            class="welcome-subgroup-title"
            style="flex: 0 0 auto"
          >Recent</h3>
          <div
            class="welcome-tile-group"
            style="flex: 1 1 auto; height: 0"
          >
            <template v-for="project in state.projects">
              <UiButton class="welcome-tile" :key="project.id">
                <div>
                  <p>{{project.name}}</p>
                  <p>Last modified on {{formatDate(project.lastModified)}} at {{formatTime(project.lastModified)}}</p>
                </div>
              </UiButton>
            </template>
          </div>
        </div>
      </div>
      <div class="welcome-column">
        <div class="welcome-group">
          <h2 class="welcome-group-title">Settings</h2>
          <div class="welcome-tile-group">
            <UiButton icon="keyboard" class="welcome-tile">
              <div>
                <p>Input</p>
                <p>Key bindings, direction and distance formats...</p>
              </div>
            </UiButton>
            <UiButton icon="color_lens" class="welcome-tile" v-on:click="openAppearanceSettings">
              <div>
                <p>Appearance</p>
                <p>Colors, font sizes, date and time formats...</p>
              </div>
            </UiButton>
          </div>
        </div>
      </div>
    </div>
    <AppearanceSettings ref="appearanceSettings" />
    <ProjectCreateEdit
      v-if="projectCreateOpen"
      @close="projectCreateOpen = false"
    />
    <!-- <InputSettings /> -->
  </div>
</template>

<style scoped>
  #welcome {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem;
    width: 100%;
  }
  .welcome-column {
    display: flex;
    flex-direction: column;
  }
  #welcome-columns {
    display: flex;
    flex: 1 1 auto;
    height: 100%;
  }
  #welcome-columns > div {
    flex: 1 0 50%;
    padding: 0 2rem;
  }
  .welcome-group {
    display: flex;
    flex-direction: column;
  }
  .welcome-group-title {
    margin: 0;
  }
  .welcome-tile-group {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }
  .welcome-subgroup-title {
    margin: 1rem 0 0 0;
  }
  .welcome-tile {
    cursor: pointer;
    min-height: 5rem;
    margin: 0.5rem 0;
    justify-content: flex-start;
    text-transform: none;
  }
  .welcome-tile p {
    text-align: left;
  }
  .welcome-tile p {
    font-size: 1.05rem;
    margin: 0;
  }
  .welcome-tile p+p {
    font-size: 0.85rem;
    letter-spacing: 0.02rem;
    margin-top: 0.6rem;
  }
</style>
<style>
  .welcome-tile .ui-button__icon {
    margin: 0 1rem 0 0;
  }
</style>

<script>

import {
  UiButton
} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import AppearanceSettings from './AppearanceSettings';
import {state} from '../main.js';
import Project from '../Project.js';
import ProjectCreateEdit from './ProjectCreateEdit';
import {
  formatDate,
  formatTime,
  getRootFontSize
} from '../viz.js';

export default {
  name: 'Welcome',
  computed: {
    recentProjects() {
      const numberThatFit = 0;
    }
  },
  data() {
    return {
      state,
      projectCreateOpen: false
    };
  },
  methods: {
    formatDate,
    formatTime,
    newProject() {
      this.projectCreateOpen = true;
    },
    openAppearanceSettings() {
      this.$refs.appearanceSettings.open();
    },
    openProjects() {
      state.header = 'Projects';
      state.activeView = 'projects';
    },
    openTemplates() {
      state.header = 'Project Templates';
      state.activeView = 'templates';
    }
  },
  components: {
    AppearanceSettings,
    ProjectCreateEdit,
    UiButton
  }
};

</script>
