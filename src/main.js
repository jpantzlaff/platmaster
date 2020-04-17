import {v1 as uuid} from 'uuid';
import Vue from 'vue';

import App from './App.vue';
import Db from './db.js';

export const db = new Db();

export const state = {
  activeView: 'welcome',
  appearance: {
    color1: '#ffffff',
    color2: '#eeeeee',
    colorText: '#000000',
    darkEditor: false,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12-hour'
    // fontScale: 100
  },
  header: null,
  project: null,
  projects: [],
  templates: []
};
console.log(JSON.stringify(state.appearance));

import {
  setAccentColor,
  setBackgroundColor,
  setTextColor
} from './viz.js';

(async function() {
  await db.initialize();
  const [settings] = await Promise.all([
    db.select('settings', ['id', 'eq', 1])
  ]);
  console.log(settings);
  if (settings.length > 0) {
    const row = settings[0];
    for (let prop in state.appearance) {
      if (row[prop]) state.appearance[prop] = row[prop];
    }
    setAccentColor(state.appearance.color2);
    setBackgroundColor(state.appearance.color1);
    setTextColor(state.appearance.colorText);
  }
  console.log(JSON.stringify(state.appearance));

  new Vue({
    render: (h) => h(App)
  }).$mount('#app');

  console.log(state);
})();

// projects: [
//   {
//     name: 'sample1',
//     id: uuid(),
//     lastModified: new Date('2019-12')
//   },
//   {
//     name: 'sample2',
//     id: uuid(),
//     lastModified: new Date('2019-11')
//   },
//   {
//     name: 'sample3',
//     id: uuid(),
//     lastModified: new Date('2019-10')
//   }
// ]