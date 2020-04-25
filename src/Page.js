export default class Page {
  constructor(config) {
    this.file = config.file;
    this.id = config.id;
    this.points = [];
    this.objectUrl = URL.createObjectURL(this.file);
    this.size = new Promise((resolve) => {
      const image = new Image();
      image.src = this.objectUrl;
      image.decode().then(() => {
        resolve({
          height: image.naturalHeight,
          width: image.naturalWidth
        });
      });
    });
  }
};