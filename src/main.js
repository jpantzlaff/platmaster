import Vue from 'vue';

import App from './App.vue';
import DB from './db.js';
import Project from './Project.js';
import ProjectTemplate from './ProjectTemplate.js';

export const db = new DB();

export const state = {
  activeView: 'welcome',
  appearance: {
    color1: '#283354',
    color2: '#212B48',
    colorText: '#DDE6FF',
    darkEditor: false,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12-hour'
  },
  header: null,
  input: {
    directionFormat: 'D.M.S',
    distanceFormat: '1234.56',
    hotkeys: {
      continueLine: {
        name: 'Continue in previous direction',
        key: 'alt+w'
      },
      drawLine: {
        name: 'Activate line drawing tool',
        key: 'alt+a'
      },
      repeat: {
        name: 'Repeat previous line',
        key: 'alt+d'
      },
      undo: {
        name: 'Undo',
        key: 'alt+z'
      }
      // connectWithCurve: 'alt+c'
      // toggleSnapping: 'alt+s'
    }
  },
  project: null,
  projects: [],
  templates: []
};

import {
  setAccentColor,
  setBackgroundColor,
  setTextColor,
  setEditorColor
} from './viz.js';

(async function() {
  await db.initialize();
  const [projects, settings, templates] = await Promise.all([
    db.select('projects'),
    db.select('settings', ['id', 'eq', 1]),
    db.select('templates')
  ]);
  for (let row of projects) {
    const project = new Project();
    for (let prop in project) {
      if (row[prop]) project[prop] = row[prop];
    }
    state.projects.push(project);
  }
  if (settings.length > 0) {
    const row = settings[0];
    for (let prop in state.appearance) {
      if (row[prop]) state.appearance[prop] = row[prop];
    }
  }
  for (let row of templates) {
    const template = new ProjectTemplate();
    for (let prop in template) {
      if (row[prop]) template[prop] = row[prop];
    }
    state.templates.push(template);
  }
  setAccentColor(state.appearance.color2);
  setBackgroundColor(state.appearance.color1);
  setEditorColor(state.appearance.darkEditor ? 'black' : 'white');
  setTextColor(state.appearance.colorText);

  new Vue({
    render: (h) => h(App)
  }).$mount('#app');

  console.log(state);
})();