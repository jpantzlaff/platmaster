export default class ProjectTemplate {
  static distanceUnits = [
    {label: 'Meter', value: 1},
    {label: 'Foot (International)', value: 0.3048},
    {label: 'Foot (US)', value: 0.3048006096012192}
  ];

  constructor() {
    this.bearingBasisType = 'None';
    this.crs = null;
    this.date = null;
    this.distanceBasisType = 'Ground';
    this.distanceUnit = ProjectTemplate.distanceUnits[0];
    this.name = 'Untitled';
    this.modifiedDate = new Date();
  }
};