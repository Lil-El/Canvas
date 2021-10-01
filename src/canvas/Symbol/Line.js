export function makeLine(points = [], options){
    return new fabric.Line(points, {
        id: new Date(),
        left: 0,
        top: 0,
        stroke: "blue",
        strokeWidth: 3,
        ...options
    })
}