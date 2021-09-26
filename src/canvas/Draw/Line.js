export function makeLine(points = [], options){
    return new fabric.Line(points, {
        id: Date.now(),
        left: 0,
        top: 0,
        stroke: "blue",
        strokeWidth: 3,
        ...options
    })
}