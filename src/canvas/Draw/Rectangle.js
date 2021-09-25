export function makeRect(options){
    return new fabric.Rect({
        id: Date.now(),
        left: 0,
        top: 0,
        fill: "green",
        width: 0,
        height: 0,
        ...options
    })
}