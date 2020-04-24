export default class Page {
  constructor(config) {
    this.file = config.file;
    this.id = config.id;
    this.points = [];
    this.objectUrl = URL.createObjectURL(this.file);
  }
};