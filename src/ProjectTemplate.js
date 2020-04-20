import {v1 as uuid} from 'uuid';

export default class ProjectTemplate {
  constructor() {
    this.id = uuid();
    this.bearingBasisDate = null;
    this.bearingBasisType = 'None';
    this.crs = {};
    this.distanceBasisType = 'Ground';
    this.distanceUnits = [
      {label: 'Meter', value: 'm'},
      {label: 'Foot (International)', value: 'ft'},
      {label: 'Foot (US)', value: 'us-ft'}
    ];
    this.distanceUnit = this.distanceUnits[0];
    this.lastUsed = new Date();
    this.name = 'Untitled';
  }
};