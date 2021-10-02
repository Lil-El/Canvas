export function makeCircle(options){
    return new fabric.Circle({
        id: new Date(),
        left: 0, 
        top: 0,
        fill: "red",
        radius: 0,
        strokeUniform: true, // stroke不会因为scale而发生变化
        ...options
    })
}
export function makeOperateCircle(options){
    return makeCircle({
        _isOperate: true,
        hasControls: false,
        ...options
    })
}