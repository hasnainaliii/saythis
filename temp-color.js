const fs = require('fs');
const path = require('path');

// Basic PNG IDAT parsing to find the first pixel color
// Or simply read the Theme colors to see if they match the screenshot.
// Since we don't have jimp, let's just write a very simple chunk reader to find the first IDAT,
// inflate it, and read the first RGB.

const zlib = require('zlib');

function readFirstPixel(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.readUInt32BE(0) !== 0x89504E47) return null; // Not PNG

    let offset = 8;
    let idatBuffers = [];
    let width = 0;
    let height = 0;
    let colorType = 0;
    let bitDepth = 0;

    while (offset < buffer.length) {
        const length = buffer.readUInt32BE(offset);
        const type = buffer.toString('ascii', offset + 4, offset + 8);
        const dataOffset = offset + 8;

        if (type === 'IHDR') {
            width = buffer.readUInt32BE(dataOffset);
            height = buffer.readUInt32BE(dataOffset + 4);
            bitDepth = buffer.readUInt8(dataOffset + 8);
            colorType = buffer.readUInt8(dataOffset + 9);
        } else if (type === 'IDAT') {
            idatBuffers.push(buffer.slice(dataOffset, dataOffset + length));
        } else if (type === 'IEND') {
            break;
        }

        offset = dataOffset + length + 4; // +4 for CRC
    }

    if (idatBuffers.length === 0) return null;
    const deflated = Buffer.concat(idatBuffers);
    const inflated = zlib.inflateSync(deflated);

    // The first byte is the filter type for the first scanline
    let r, g, b;
    if (colorType === 2) { // RGB
        r = inflated[1];
        g = inflated[2];
        b = inflated[3];
    } else if (colorType === 6) { // RGBA
        r = inflated[1];
        g = inflated[2];
        b = inflated[3];
    } else if (colorType === 3) { // Indexed
        const paletteBuffer = fs.readFileSync(filePath);
        // Indexed needs PLTE reading, too complex for now
        return null;
    }
    
    if (r !== undefined) {
       const hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
       return hex.toUpperCase();
    }
    return null;
}

const dir = path.join(__dirname, 'src/assets/images/emoji');
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.png')) {
        const hex = readFirstPixel(path.join(dir, file));
        console.log(`${file}: ${hex || 'Could not parse'}`);
    }
});
