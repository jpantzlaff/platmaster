import bearing from '@turf/bearing';
import proj4 from 'proj4';

import {state} from './main.js';

export function degToDms(degrees) {
  let remainder = degrees;
  const deg = Math.floor(degrees);
  remainder -= deg;
  const min = Math.floor(remainder * 60);
  remainder -= (min / 60);
  const sec = Math.round(remainder * 3600);
  return [deg, min, sec];
};

export function degToRad(deg) {
  return deg * (Math.PI / 180);
};

export function destination(source, direction, distance) {
  const [x, y] = source;
  let dir = direction + state.localCrs.offset;
  if (dir < 0) dir += 360;
  else if (dir >= 360) dir -= 360;
  const angle = directionToAngle(dir);
  return [
    x + (distance * Math.cos(angle)),
    y + (distance * Math.sin(angle))
  ];
};

export function dmsToDeg(dms) {
  const [deg, min, sec] = dms;
  if (!(deg >= 0 && deg < 360)) {
    throw Error('Degrees outside range 0-360');
  }
  if (!(min >= 0 && min < 60)) {
    throw Error('Minutes outside range 0-60');
  }
  if (!(sec >= 0 && sec < 60)) {
    throw Error('Seconds outside range 0-60');
  }
  return deg + (min / 60) + (sec / 3600);
};

export function directionToAngle(direction) {
  let n = direction;
  n = 90 - n;
  if (n < 0) n += 360;
  return(degToRad(n));
};

export async function getJson(url, params) {
  const target = new URL(url);
  Object.entries(params).forEach((p) => target.searchParams.append(...p));
  let response;
  try {
    response = await fetch(target.href).then((r) => r.text());
  } catch {
    throw Error('No network connection.');
  }
  try {
    return JSON.parse(response);
  } catch {
    throw Error(`Request to ${url} did not return JSON. Response:\n${response}`);
  }
};

export async function getMagDecl(coord, date) {
  const [lon1, lat1] = coord;
  const year = date.getFullYear();
  let model;
  if (year >= 2019) {
    model = 'WMM';
  } else if (year >= 2000) {
    model = 'EMM';
  } else if (year >= 1590) {
    model = 'IGRF';
  } else {
    throw Error('Magnetic declination data are not available for years prior to 1590.');
  }
  const response = await getJson('https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination', {
    lat1,
    lat1Hemisphere: (lat1 < 0) ? 'S' : 'N',
    lon1,
    lon1Hemisphere: (lon1 < 0) ? 'W' : 'E',
    magneticComponent: 'd',
    model,
    resultFormat: 'json',
    startDay: date.getDate(),
    startMonth: date.getMonth() + 1,
    startYear: year
  });
  try {
    return response.result[0].declination;
  } catch {
    throw Error('A magnetic declination could not be calculated.');
  }
};

export function gridConvergence(crs, x, y) {
  if (crs.kind === 'CRS-GEOGCRS') return 0;
  const proj = proj4(crs.proj4);
  const a = proj.inverse([x, y]);
  const b = proj.inverse([x, y + 10]);
  return bearing(a, b);
};

export async function queryProj(query) {
  const response = await getJson('https://epsg.io', {
    format: 'json',
    q: query
  });
  return (Array.isArray(response?.results))
    ? response.results.map((r) => {
      return {
        accuracy: r.accuracy,
        area: r.area,
        code: r.code,
        kind: r.kind,
        name: r.name,
        proj4: r.proj4,
        unit: r.unit
      };
    })
    : [];
};

export function radToDeg(rad) {
  return 180 * (rad / Math.PI);
};