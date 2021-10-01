export function makeCircle(options){
    return new fabric.Circle({
        id: new Date(),
        left: 0, 
        top: 0,
        fill: "red",
        radius: 0,
        ...options
    })
}
export function makeOperateCircle(){
    return makeCircle({
        _isOperate: true
    })
}