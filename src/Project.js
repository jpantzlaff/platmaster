import {v1 as uuid} from 'uuid';

export default class Project {
  constructor() {
    this.id = uuid();
    this.crs = null;
    this.documentCrs = {};
    this.lastModified = new Date();
    this.name = 'Untitled';
    // this.distUnit = null;
    // this.bearingBasis = null;
    // this.distanceBasis = null;
  }

  static async fromTemplate(template) {
    const project = new Project();
    project.documentCrs = project.crs;
    project.name = template.name;
    return project;
  }
};