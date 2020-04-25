import Vue from 'vue';

import App from './App.vue';
import DB from './db.js';

export const db = new DB();

export const state = {
  activePage: null,
  activePoint: null,
  form: {
    bearingBasisDate: null,
    bearingBasisType: 'True/geodetic north',
    crs: {},
    distanceUnit: {label: 'Meter', value: 'm'},
    files: [],
    name: 'Untitled',
    previewUrl: null
  },
  localCrs: {
    offset: 0,
    proj4: null
  },
  pages: [],
  pendingPoint: null,
  points: [],
  settings: {
    color1: '#283354',
    color2: '#212B48',
    colorText: '#DDE6FF',
    darkEditor: false,
    dateFormat: 'YYYY-MM-DD',
    directionFormat: 'N 45.33.36 E'
  }
};

export function saveSettings() {
  const {color1, color2, colorText} = state.settings;
  db.insert('settings', {
    id: 1,
    ...state.settings,
    color1: (typeof color1 === 'string') ? color1 : color1.hex,
    color2: (typeof color2 === 'string') ? color2 : color2.hex,
    colorText: (typeof colorText === 'string') ? colorText : colorText.hex
  }, true);
};

import {
  setAccentColor,
  setBackgroundColor,
  setTextColor,
  setEditorColor
} from './viz.js';

(async function() {
  await db.initialize();
  const settings = await db.select('settings', ['id', 'eq', 1]);
  if (settings.length > 0) {
    const row = settings[0];
    for (let prop in state.settings) {
      if (row[prop]) state.settings[prop] = row[prop];
    }
  }
  setAccentColor(state.settings.color2);
  setBackgroundColor(state.settings.color1);
  setEditorColor(state.settings.darkEditor ? 'black' : 'white');
  setTextColor(state.settings.colorText);

  new Vue({
    render: (h) => h(App)
  }).$mount('#app');

  console.log(state);
})();