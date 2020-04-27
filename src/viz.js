import {state} from './main.js';
import {
  degToDms,
  dmsToDeg
} from './util.js';

const dateFormats = {
  'YYYY-MM-DD': 'en-CA',
  'MM/DD/YYYY': 'en-US',
  'DD/MM/YYYY': 'en-GB'
};
export function formatDate(date) {
  return date.toLocaleDateString(dateFormats[state.settings.dateFormat]);
};

export function formatDirection(direction) {
  const format = state.settings.directionFormat;
  if (format === '45.56') return String(direction);
  let cardinal1, cardinal2, deg;
  if (direction >= 0 && direction <= 90) {
    cardinal1 = 'N';
    cardinal2 = 'E';
    deg = direction;
  } else if (direction > 90 && direction <= 180) {
    cardinal1 = 'S';
    cardinal2 = 'E';
    deg = 180 - direction;
  } else if (direction > 180 && direction <= 270) {
    cardinal1 = 'S';
    cardinal2 = 'W';
    deg = direction - 180;
  } else {
    cardinal1 = 'N';
    cardinal2 = 'W';
    deg = 360 - direction;
  }
  const sep = (format === 'N 45-33-36 E') ? '-' : '.';
  return `${cardinal1} ${degToDms(deg).join(sep)} ${cardinal2}`;
};

export function parseDirection(string) {
  const format = state.settings.directionFormat;
  if (format === '45.56') {
    const number = Number(string);
    if (Number.isFinite(number)) {
      if (number >= 0 && number < 360) {
        return number;
      } else {
        throw Error('Number outside range 0-360');
      }
    } else {
      throw Error('Invalid characters in string');
    }
  }
  const sep = (format === 'N 45-33-36 E') ? '-' : '.';
  const noSpaces = string.replace(/ /g, '');
  const dir1 = noSpaces[0].toUpperCase();
  const dir2 = noSpaces.slice(-1).toUpperCase();
  const dms = noSpaces.slice(1, -1).split(sep).map((x) => Number(x));
  if (!['N', 'S'].includes(dir1)) {
    throw Error('Invalid leading direction');
  }
  if (!['E', 'W'].includes(dir2)) {
    throw Error('Invalid trailing direction');
  }
  if (dms.length < 3 || dms.some((x) => Number.isNaN(x))) {
    throw Error('Invalid number');
  }
  if (dms[0] > 90) throw Error('Invalid number');
  const deg = dmsToDeg(dms);
  if (dir1 === 'N') {
    if (dir2 === 'E') {
      return deg;
    } else {
      return 360 - deg;
    }
  } else if (dir2 === 'E') {
    return 180 - deg;
  } else {
    return 180 + deg;
  }
};

export function setAccentColor(value) {
  document.documentElement.style.setProperty('--color2', value);
};

export function setBackgroundColor(value) {
  document.documentElement.style.setProperty('--color1', value);
};

export function setEditorColor(value) {
  document.documentElement.style.setProperty('--editor-filter', `invert(${value ? 1 : 0})`);
};

export function setTextColor(value) {
  document.documentElement.style.setProperty('--text-color', value);
  document.documentElement.style.setProperty('--light-text-color', value.slice(0, 7) + '77');
};