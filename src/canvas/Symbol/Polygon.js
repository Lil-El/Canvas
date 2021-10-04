export function makePolygon(points = [], options) {
    return new fabric.Polygon(points, {
        id: new Date(),
        fill: "red",
        objectCaching: false,
		transparentCorners: false,
        // strokeUniform: true, 使用该属性，会使points编辑时造成偏移
        ...options,
    });
}
