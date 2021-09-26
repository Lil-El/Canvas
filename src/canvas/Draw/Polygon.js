export function makePolygon(points = [], options) {
    return new fabric.Polygon(points, {
        fill: "red",
        ...options,
    });
}
