export function makePolyline(points = [], options) {
    return new fabric.Polyline(points, {
        fill: "transparent",
        stroke: "red",
        strokeWidth: 3,
        ...options,
    });
}
