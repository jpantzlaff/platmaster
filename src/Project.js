import {v1 as uuid} from 'uuid';

import CRS from './crs.js';

export default class Project {
  constructor() {
    this.id = uuid();
    this.crs = null;
    this.documents = [];
    this.documentCrs = {};
    this.lastModified = new Date();
    this.name = 'Untitled';
    // this.distUnit = null;
    // this.bearingBasis = null;
    // this.distanceBasis = null;
  }

  static async fromTemplate(template) {
    const project = new Project();
    project.documentCrs = (project.crs.value) ? new CRS(project.crs.value) : null;
    project.name = template.name;
    return project;
  }
};