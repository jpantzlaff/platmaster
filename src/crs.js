import bearing from '@turf/bearing';
import proj4 from 'proj4';

import {
  directionToAngle,
  getJson
} from './util.js';

export default class CRS {
  constructor(config) {
    this.accuracy = config.accuracy;
    this.area = config.area;
    this.code = config.code;
    this.kind = config.kind;
    this.name = config.name;
    this.offset = 0;
    this.proj4 = config.proj4;
    this.unit = config.unit;
  }

  destination(source, direction, distance) {
    const [x, y] = source;
    const angle = directionToAngle(direction);
    return [
      x + (distance * Math.cos(angle)),
      y + (distance * Math.sin(angle))
    ];
  }

  fromWgs84(coords) {
    return proj4(this.proj4, coords);
  }
  
  gridConvergence(x, y) {
    if (this.kind === 'CRS-GEOGCRS') return 0;
    return bearing(
      this.toWgs84([x, y]),
      this.toWgs84([x, y + 10])
    );
  }

  // async initializeConvergence(lat, lon, magnetic = false, date = null) {
  //   if (Number.isFinite(this.convergence)) return;
  //   if (magnetic) {
  //     this.convergence = await CRS.getMagDecl([lon, lat], date);
  //   } else {

  //   }
  // }

  project(toCrs, coords) {
    return proj4(this.proj4, toCrs.proj4, coords);
  }

  setUnit(value) {
    this.proj4 = this.proj4.replace(/units=\w+ ?/, `units=${value} `);
    this.unit = value;
  }

  toWgs84(coords) {
    return proj4(this.proj4).inverse(coords);
  }

  /**
   * Retrieves magnetic declination in degrees for the specified location and date.
   * @param {[number, number]} coord [x, y] coordinates of location.
   * @param {Date} date 
   * @returns {number}
   */
  static async getMagDecl(coord, date) {
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
  }

  static newAeqd(lat, lon, unit) {
    const crs = new CRS();
    crs.proj4 = `+proj=aeqd +lat_0=${lat} +lon_0=${lon} +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=${unit} +no_defs`;
    return crs;
  }
  
  /**
   * @typedef {Object} ProjQuery
   * @property {number} accuracy
   * @property {string} area
   * @property {number} code
   * @property {string} name
   * @property {string} proj4
   * @property {string} unit
   */

  /**
   * Queries EPSG.io for geographic projection data.
   * @param {string} query A EPSG code, location, etc. to query.
   * @returns {ProjQuery}
   */
  static async queryProj(query) {
    const response = await getJson('https://epsg.io', {
      format: 'json',
      q: query
    });
    return (Array.isArray(response?.results))
      ? response.results.map((r) => {
        return new CRS({
          accuracy: r.accuracy,
          area: r.area,
          code: r.code,
          kind: r.kind,
          name: r.name,
          proj4: r.proj4,
          unit: r.unit
        });
      })
      : [];
  }
};