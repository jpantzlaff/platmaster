export default class Document {
  constructor() {
    this.buffer = null;
    this.tie1 = {
      pixel: [],
      source: [],
      wgs84: []
    };
    this.tie2 = {
      pixel: [],
      source: [],
      wgs84: []
    };
  }
};