export function makePolygon(points = [], options) {
    return new fabric.Polygon(points, {
        id: new Date(),
        fill: "red",
        objectCaching: false,
		transparentCorners: false,
        ...options,
    });
}
