import Vue from 'vue';

import App from './App.vue';
import Db from './db.js';
import ProjectTemplate from './ProjectTemplate.js';

export const db = new Db();

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
  project: null,
  projects: [],
  templates: []
};

import {
  setAccentColor,
  setBackgroundColor,
  setTextColor
} from './viz.js';

(async function() {
  await db.initialize();
  const [settings, templates] = await Promise.all([
    db.select('settings', ['id', 'eq', 1]),
    db.select('templates')
  ]);
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
  setTextColor(state.appearance.colorText);

  new Vue({
    render: (h) => h(App)
  }).$mount('#app');

  console.log(state);
})();