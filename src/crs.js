import {getJson} from './util.js';

export default class Crs {
  constructor() {
    this.proj = null;
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
      q: encodeURIComponent(query)
    });
    return {
      accuracy: response.accuracy,
      area: response.area,
      code: response.code,
      name: response.name,
      proj4: response.proj4,
      unit: response.unit
    };
  }
};