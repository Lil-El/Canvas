export function makeCircle(options){
    return new fabric.Circle({
        left: 0, 
        top: 0,
        fill: "red",
        radius: 0,
        id: new Date(),
        ...options
    })
}
export function makeOperateCircle(){
    return makeCircle({
        _isOperate: true
    })
}