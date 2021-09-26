export function makePolyline(points = [], options) {
    return new fabric.Polyline(points, {
        fill: "red",
        ...options,
    });
}
