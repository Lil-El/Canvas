import { useEffect, useState } from "react";
let _setSize = null;
let _canvas = null;
let _queue = null;

export function useObjSize(canvas){
    let [current, setCurrent] = useState(null);
    let [queue, setQueue] = useState([])
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
        console.log("current: ", current);
        let removeListener = null;
        if(queue.includes(current)){ // 包含了就不添加事件了，已经添加过了

        }else {
            current && setQueue([...new Set([...queue, current])]);
        }
        removeListener = onSizeChange(canvas, current, (obj)=>{
            setSize({
                width: Math.round(obj.width * obj.scaleX),
                height: Math.round(obj.height * obj.scaleY)
            })
        });
        return ()=>{
            removeListener?.();
        };
    }, [current])

    return [current, size]
}
let state = null;

let onMouseDown = ({target})=>{
    console.log('onMouseDown');
    state = target;
    // selected = obj?.id === target?.id ? obj : null;
    // selected && 
    if(state){
        _setSize(target)
        _canvas.on("mouse:move", onMouseMove)
    }
}
let onMouseMove = ({target})=>{
    console.log('onMouseMove');
    if(state){
        _setSize(target)
    }
}
let onMouseUp = ()=>{
    console.log('onMouseUp');
    state = null;
    _canvas.off("mouse:move");
}
let onSelected = function() {
    console.log('onSelected');
    _canvas.on("mouse:down", onMouseDown)
    _canvas.on("mouse:up", onMouseUp)
}
let onModified = function({target}) { // PS：不能在这里移除 canvas 事件
    console.log('onModified');
    _setSize(target)
}
export function onSizeChange(canvas, obj, setSize){
    if(!obj) return void 0;
    if(queue?.includes(obj)){
    }else{
        obj.on("selected", onSelected)
        obj.on("modified", onModified)
    }
    
    return () => {
        console.log('unsub');
        canvas.off("mouse:down", onMouseDown);
        canvas.off("mouse:move");
        canvas.off("mouse:up", onMouseUp);
    }
}
