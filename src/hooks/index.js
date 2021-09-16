import { useEffect, useState } from "react";
let _setSize = null;
let _canvas = null;
export function useObjSize(canvas){
    let [current, setCurrent] = useState(null);
    let [effect, setEffect] = useState(null)
    let [objArr, pushObj] = useState([])
    let [size, setSize] = useState({
        width: 0,
        height: 0
    })

    useEffect(()=>{
        _canvas = canvas;
        canvas && canvas.on("mouse:down", ({target})=>{
            setCurrent(target)
        })
    }, [canvas])

    useEffect(()=>{
        _setSize = setSize;
        console.log("setCurrent")
        // if(current?.id && !objArr.includes(current.id)){
        //     pushObj([...objArr, current.id]);
            let removeListener = onSizeChange(canvas, current, (obj)=>{
                setSize({
                    width: Math.round(obj.width * obj.scaleX),
                    height: Math.round(obj.height * obj.scaleY)
                })
            });
            // setEffect(removeListener)
        // }
        return ()=>{
            // effect?.();
            removeListener?.();
        };
    }, [current])

    return [current, size]
}
let state = false;
let selected = null;

let onMouseDown = ({target})=>{
    console.log('onMouseDown');
    state = true;
    // selected = obj?.id === target?.id ? obj : null;
    // selected && 
    _setSize(target)
    _canvas.on("mouse:move", onMouseMove)
}
let onMouseMove = ({target})=>{
    console.log('onMouseMove');
    if(state){ //&& selected
        _setSize(target)
    }
}
let onMouseUp = ()=>{
    console.log('onMouseUp');
    state = false;
    selected = null;
    _canvas.off("mouse:move");
}
let onSelected = function() {
    console.log('onSelected');
    _canvas.on("mouse:down", onMouseDown)
    _canvas.on("mouse:up", onMouseUp)
}
let onModified = function({target}) {
    console.log('onModified');
    _setSize(target)
}
export function onSizeChange(canvas, obj, setSize){
    console.log('sizeChange:', obj);
    if(!obj) return void 0;
    console.log(canvas);
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:up", onMouseUp);
    obj.off("selected")
    obj.off("modified")
    obj.on("selected", onSelected)
    obj.on("modified", onModified)
    
    return () => {
        console.log('unsub2');
        // canvas.off("mouse:down", onMouseDown);
        // canvas.off("mouse:up", onMouseUp);
    }
}