export function makePolyline(points = [], options) {
    return new fabric.Polyline(points, {
        id: new Date(),
        fill: "transparent",
        stroke: "red",
        strokeWidth: 3,
        objectCaching: false,
		transparentCorners: false,
        // strokeUniform: true, 使用该属性，会使points编辑时造成偏移
        strokeDashArray: [30, 10],
        ...options,
    });
}
