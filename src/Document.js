export default class Document {
  constructor() {
    this.buffer = null;
    this.tie1 = {
      pixel: [],
      wgs84: []
    };
    this.tie2 = {
      pixel: [],
      wgs84: []
    };
  }
};