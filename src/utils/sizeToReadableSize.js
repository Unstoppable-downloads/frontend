/**
 *
 * @param {number} fileSize size to convert to readable size
 */
export function sizeToReadableSize(fileSize) {
    var unitPower = 0;
    let convertedSize = fileSize;
    var unit = "B";

    console.log("size un converted", convertedSize)
    while (convertedSize > 1024) {
        convertedSize = convertedSize / 1024;
        console.log("size", convertedSize)
        unitPower += 3;
    }
    switch (unitPower) {
        case 3:
            unit = "KB";
            break;
        case 6:
            unit = "MB";
            break;
        case 9:
            unit = "GB";
            break;
        case 12:
            unit = "TB";
            break;
        default:
            break;
    }
    convertedSize = Math.round(convertedSize)
    return [convertedSize, unit];
}