import {v1 as uuid} from 'uuid';
import Vue from 'vue';

import App from './App.vue';

const stateData = {
  appearance: {
    color1: '#ffffff',
    color2: '#eeeeee',
    colorText: '#000000',
    darkEditor: false
  },
  header: null,
  project: null,
  projects: [
    {
      name: 'sample1',
      id: uuid(),
      lastModified: new Date('2019-12')
    },
    {
      name: 'sample2',
      id: uuid(),
      lastModified: new Date('2019-11')
    },
    {
      name: 'sample3',
      id: uuid(),
      lastModified: new Date('2019-10')
    }
  ]
};
  
export const state = new Proxy(stateData, {});

document.querySelector('head').insertAdjacentHTML('beforeend', `
  <style>
    *:not(.vc-editable-input) {
      color: #000000 !important;
    }
    #rest, .ui-modal__body {
      background-color: #ffffff !important;
    }
    #header, .ui-button, .ui-modal__header {
      background-color: #eeeeee !important;
    }
  </style>
`);
const stylesheet = document.styleSheets[document.styleSheets.length - 1];
console.log(stylesheet.cssRules);
export const globalStyle = {
  setAccentColor(value) {
    // stylesheet.cssRules[2].style.backgroundColor = value;
    stylesheet.cssRules[2].style.setProperty('background-color', value, 'important');
  },
  setBackgroundColor(value) {
    // stylesheet.cssRules[1].style.backgroundColor = value;
    stylesheet.cssRules[1].style.setProperty('background-color', value, 'important');
  },
  setTextColor(value) {
    // stylesheet.cssRules[0].style.color = value;
    stylesheet.cssRules[0].style.setProperty('color', value, 'important');
  }
};

new Vue({
  render: (h) => h(App)
}).$mount('#app');


console.log(state);