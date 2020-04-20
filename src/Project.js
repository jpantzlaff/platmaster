import {v1 as uuid} from 'uuid';

import CRS from './crs.js';

export default class Project {
  constructor() {
    this.id = uuid();
    this.crs = null;
    this.bearingBasis = null;
    this.bearingBasisDate = null;
    this.distanceBasis = null;
    this.documents = [];
    this.documentCrs = {};
    this.lastModified = new Date();
    this.name = 'Untitled';
    this.unit = null;
  }

  static async fromTemplate(template) {
    const project = new Project();
    project.documentCrs = (template.crs.value) ? new CRS(template.crs.value) : null;
    project.bearingBasis = template.bearingBasisType;
    project.bearingBasisDate = template.bearingBasisDate;
    project.distanceBasis = template.distanceBasisType;
    if (project.bearingBasis === 'Grid' && project.distanceBasis === 'Grid') {
      project.crs = new CRS(template.crs.value);
    }
    project.name = template.name;
    project.unit = template.distanceUnit.value;
    return project;
  }
};