export function getDistance(xVector, yVector) {
    return Math.sqrt(Math.pow(xVector, 2) + Math.pow(yVector, 2));
}

export function normalize(xVector, yVector, distance) {
    xVector = xVector / distance;
    yVector = yVector / distance;

    return { xVector, yVector };
}

export function getVector(x1, y1, x2, y2) {
    let xVector = x2 - x1;
    let yVector = y2 - y1;

    return { xVector, yVector }
}