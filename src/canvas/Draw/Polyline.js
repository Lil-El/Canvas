export function makePolyline(points = [], options) {
    return new fabric.Polyline(points, {
        id: new Date(),
        fill: "transparent",
        stroke: "red",
        strokeWidth: 3,
        ...options,
    });
}
