import {state} from './main.js';

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

export function getRootFontSize() {
  return Number(getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2));
};

export function setAccentColor(value) {
  document.documentElement.style.setProperty('--color2', value);
};

export function setBackgroundColor(value) {
  document.documentElement.style.setProperty('--color1', value);
};

export function setTextColor(value) {
  document.documentElement.style.setProperty('--text-color', value);
  document.documentElement.style.setProperty('--light-text-color', value.slice(0, 7) + '77');
};

// export function setTextScale(value) {
//   document.querySelector('html').style.fontSize = `${value / 100 * 16}px`;
// };