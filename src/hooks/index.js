import { useCallback, useEffect, useState, useRef } from "react";

function handleSize(setState, obj){
    setState({
        width: Math.round(obj.width * obj.scaleX),
        height: Math.round(obj.height * obj.scaleY)
    })
}

export function useObjSize(canvas){
    let [current, setCurrent] = useState(null);
    let [queue, setQueue] = useState([])
    let [size, setSize] = useState({
        width: 0,
        height: 0
    })
    
    let state = null;
    let onMouseDown = useCallback(({target})=>{
        console.log('onMouseDown');
        state = target;
        if(state){
            handleSize(setSize, target)
            canvas.on("mouse:move", onMouseMove)
        }
    }, [canvas])
    let onMouseMove = useCallback(({target})=>{
        console.log('onMouseMove');
        console.log(state);
        if(state){
            handleSize(setSize, target)
        }
    }, [canvas])
    let onMouseUp = useCallback(()=>{
        console.log('onMouseUp');
        state = null;
        canvas.off("mouse:move");
    }, [canvas])
    let onSelected = useCallback(function() {
        console.log('onSelected');
        canvas.on("mouse:down", onMouseDown)
        canvas.on("mouse:up", onMouseUp)
    }, [canvas])
    let onModified = useCallback(function({target}) { // PS：不能在这里移除 canvas 事件
        console.log('onModified');
        handleSize(setSize, target)
    }, [canvas])

    function onSizeChange(canvas, obj){
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

    useEffect(()=>{
        canvas && canvas.on("mouse:down", ({target})=>{
            setCurrent(target)
        })
    }, [canvas])

    useEffect(()=>{
        console.log("set current, curQueue: ", queue);
        let removeListener = null;
        if(!queue.includes(current)){ // 包含了就不添加事件了，已经添加过了
            current && setQueue([...new Set([...queue, current])]);
        }
        if(current===null){
            setSize(null)
        }
        removeListener = onSizeChange(canvas, current);
        return ()=>{
            removeListener?.();
        };
    }, [current])
    
    return [current, size]
}

export function useDrawing(canvas){
    let [drawing, setStatus] = useState(false);
    let [shape, setShape] = useState(null)
    let shapeRef = useRef()
    let [obj, setObj] = useState(null);
    

    let onMouseMove = useCallback((options)=>{
        console.log('draw move:', drawing);
        // shapeState不变：由于初始的该函数被on回调了，当函数变的时候，不会同步修改on的回调，仍然是原来的函数；
        // 使用Ref（或者普通let 变量）相当于全局变量
        if(drawing){
            const {x, y} = options.pointer;
            // .set({})   .set("width", xxx)
            shapeRef.current = {...shapeRef.current, width: Math.abs(x - shapeRef.current.left), height: Math.abs(y - shapeRef.current.top)}
            setShape(shapeRef.current)
        }
    }, [drawing])
    let onMouseDown = useCallback((options)=>{
        console.log('draw down:', drawing);
        if(drawing){
            canvas.add(obj);
            canvas.on("mouse:move", onMouseMove)
            const {x, y} = options.pointer;
            shapeRef.current = {...shapeRef.current, top: y, left: x}
            setShape(shapeRef.current)
        }
    }, [drawing])
    let onMouseUp = useCallback(()=>{
        console.log('draw up:', drawing);
        if(drawing){
            setStatus(false);
            obj.setCoords();
            canvas.off("mouse:move", onMouseMove)
        }
    }, [drawing])

    useEffect(() => {
        if(canvas && drawing) {
            shapeRef.current = {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
            }
            setShape(shapeRef.current)
            canvas.on("mouse:down", onMouseDown)
            canvas.on("mouse:up", onMouseUp)
        }
        return ()=>{
            canvas?.off("mouse:down", onMouseDown)
            canvas?.off("mouse:up", onMouseUp)
        }
    }, [canvas, drawing])

    useEffect(()=>{
        if(obj){
            obj.setOptions(shapeRef.current);
            canvas?.renderAll();
        }
    }, [obj, shape])

    return [(obj)=>{
        setObj(obj);
        setStatus(true);
    }, ()=>{
        setObj(null);
        setStatus(false);
    }] // startDrawing cancelDrawing
}

export function useShapeRect(){

}