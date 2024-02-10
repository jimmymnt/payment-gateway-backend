const sharp = require('sharp');
const path = require('path');

class Resize {
  static width;
  static height;
  constructor(folder) {
    this.folder = folder;
  }

  async save(file, width = 300, height = 300) {
    Resize.width = width;
    Resize.height = height;
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(file.path)
      // .resize(width, height, {
      //   fit: sharp.fit.inside,
      //   withoutEnlargement: true
      // })
      .toFile(filepath);

    return filename;
  }

  static filename() {
    // random file name
    return `${Resize.width}x${Resize.height}-${crypto.randomUUID()}.png`;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}

module.exports = Resize;