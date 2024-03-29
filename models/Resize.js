const sharp = require('sharp');
const uuidv4 = require('uuid/v4');
const path = require('path');

class Resize {
    constructor(folder) {
        this.folder = folder;
    }

    save(buffer) {
        const filename = Resize.filename();
        const filepath = this.filepath(filename);

        sharp(buffer)
            .resize(600, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(filepath);

        console.log(filename);
        return filename;

    }

    static filename() {
        return `${uuidv4()}.png`;
    }

    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`)
    }

}

module.exports = Resize;