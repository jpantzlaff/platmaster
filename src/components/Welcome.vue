<template>
  <div id="welcome">
    <div id="welcome-columns">
      <div>
        <div class="welcome-group">
          <h2 class="welcome-group-title">Projects</h2>
          <div class="welcome-tile-group">
            <UiButton
              id="new-project"
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
            <UiButton icon="playlist_add" class="welcome-tile">
              <div>
                <p>Manage templates</p>
                <p>Use templates to create new projects more quickly.</p>
              </div>
            </UiButton>
            <h3 class="welcome-subgroup-title">Recent</h3>
            <template v-for="project in recents">
              <UiButton class="welcome-tile" :key="project.id">
                <div>
                  <p>{{project.name}}</p>
                  <p>Last modified on {{project.lastModified.toLocaleDateString()}} at {{project.lastModified.toLocaleTimeString()}}</p>
                </div>
              </UiButton>
            </template>
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
            <UiButton icon="color_lens" class="welcome-tile">
              <div>
                <p>Appearance</p>
                <p>Colors, font sizes, date and time formats...</p>
              </div>
            </UiButton>
          </div>
        </div>
      </div>
    </div>
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
  .ui-button {
    cursor: pointer;
  }
  /* temporary rules for user testing */
  .ui-button {
    cursor: not-allowed !important;
  }
  #new-project {
    cursor: pointer !important;
  }
</style>
<style>
  .welcome-tile .ui-button__icon {
    margin: 0 1rem 0 0;
  }
</style>

<script>

import {UiButton} from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import {recents} from '../../stateTemplate.js';

export default {
  name: 'Welcome',
  data() {
    return {recents};
  },
  methods: {
    newProject() {
      this.$emit('newProject');
    }
  },
  components: {
    UiButton
  }
};

</script>
