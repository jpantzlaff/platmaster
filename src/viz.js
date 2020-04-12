import {state} from './main.js';

document.querySelector('head').insertAdjacentHTML('beforeend', `
  <style>
    * {
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

const dateFormats = {
  'YYYY-MM-DD': 'en-CA',
  'MM/DD/YYYY': 'en-US',
  'DD/MM/YYYY': 'en-GB'
};
export function formatDate(date) {
  return date.toLocaleDateString(dateFormats[state.appearance.dateFormat]);
};

const timeFormats = {
  '12-hour': 'en-US',
  '24-hour': 'en-GB'
};
export function formatTime(date) {
  return date.toLocaleTimeString(
    timeFormats[state.appearance.timeFormat],
    {timeStyle: 'short'}
  );
};

export function setAccentColor(value) {
  stylesheet.cssRules[2].style.setProperty('background-color', value, 'important');
};

export function setBackgroundColor(value) {
  stylesheet.cssRules[1].style.setProperty('background-color', value, 'important');
};

export function setTextColor(value) {
  stylesheet.cssRules[0].style.setProperty('color', value, 'important');
};

// export function setTextScale(value) {
//   document.querySelector('html').style.fontSize = `${value / 100 * 16}px`;
// };