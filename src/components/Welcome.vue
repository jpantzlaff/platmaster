<template>
  <div id="welcome">
    <div id="welcome-columns">
      <div>
        <div class="welcome-group">
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
            <UiButton icon="folder_open" class="welcome-tile">
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
            <div v-if="state.projects.length">
              <h3 class="welcome-subgroup-title">Recent</h3>
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
      </div>
      <div>
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
    <ProjectCreate ref="projectCreate" />
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
  #welcome-columns {
    display: flex;
    flex: 1 1 auto;
  }
  #welcome-columns > div {
    flex: 1 0 50%;
    padding: 0 2rem;
  }
  .welcome-group-title {
    margin: 0;
  }
  .welcome-tile-group {
    display: flex;
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
import ProjectCreate from './ProjectCreate';
import {formatDate, formatTime} from '../viz.js';

export default {
  name: 'Welcome',
  data() {
    return {
      state
    };
  },
  methods: {
    formatDate,
    formatTime,
    newProject() {
      this.$refs.projectCreate.open();
    },
    openAppearanceSettings() {
      this.$refs.appearanceSettings.open();
    },
    openTemplates() {
      state.activeView = 'templates';
      state.header = 'Project Templates';
    }
  },
  components: {
    AppearanceSettings,
    ProjectCreate,
    UiButton
  }
};

</script>
