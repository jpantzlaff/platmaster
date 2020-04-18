import {v1 as uuid} from 'uuid';

export default class ProjectTemplate {
  constructor() {
    this.id = uuid();
    this.bearingBasisDate = null;
    this.bearingBasisType = 'None';
    this.crs = {};
    this.distanceBasisType = 'Ground';
    this.distanceUnits = [
      {label: 'Meter', value: 1},
      {label: 'Foot (International)', value: 0.3048},
      {label: 'Foot (US)', value: 0.3048006096012192}
    ];
    this.distanceUnit = this.distanceUnits[0];
    this.lastUsed = new Date();
    this.name = 'Untitled';
  }
};