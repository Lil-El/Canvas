export function makePolyline(points = [], options) {
    return new fabric.Polyline(points, {
        id: new Date(),
        fill: "transparent",
        stroke: "red",
        strokeWidth: 3,
        objectCaching: false,
		transparentCorners: false,
        strokeUniform: true,
        strokeDashArray: [30, 10],
        ...options,
    });
}
