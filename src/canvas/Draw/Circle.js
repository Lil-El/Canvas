export function makeCircle(options){
    return new fabric.Circle({
        left: 0, 
        top: 0,
        fill: "red",
        radius: 0,
        id: Date.now(),
        ...options
    })
}