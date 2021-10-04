import { distance } from "../../util/math";
import { useCallback, useEffect, useState, useRef } from "react";
import { MODE, SYMBOL } from "../util/index"
import { makeCircle, makeRect, makePolygon, makePolyline, makeLine } from "../Symbol";

export function useDrawing(canvas){
    let [symbol, setSymbol] = useState(null); // 当前绘制的形状
    let [obj, setObj] = useState(null); // 当前绘制的图形object
    let shapeRef = useRef(null); // 当前绘制的图形的相关配置：圆形是radius，多边形是points等类似的

    // 绘制多边形（线）时，缓存路径上的点和线的图形
    let pointsRef = useRef([]);
    let linesRef = useRef([]);

    let onPolygonOver = useCallback(()=>{
        shapeRef.current = {points: [...pointsRef.current.slice(0, -1).map(pointer=>({x:pointer._centerX, y:pointer._centerY}))]}
        let copyObj;
        if(obj.get("type") === SYMBOL.POLYLINE) {
            copyObj = makePolyline(shapeRef.current.points)
        } else if(obj.get("type") === SYMBOL.POLYGON) {
            copyObj = makePolygon(shapeRef.current.points);
        } else if(obj.get("type") === SYMBOL.CIRCLE || obj.get("type") === SYMBOL.RECTANGLE) {
            return void endDrawing();
        }
        canvas.add(copyObj);
        canvas.remove(obj);
        endDrawing();
    }, [canvas, obj])
    let onMouseMove = useCallback((options)=>{
        // shapeState不变：由于初始的该函数被on回调了，当函数变的时候，不会同步修改on的回调，仍然是原来的函数；
        // 使用Ref（或者普通let 变量）相当于全局变量
        if(obj){
            const {x, y} = options.pointer;
            // .set({})   .set("width", xxx) .setOptions({})
            if(symbol === SYMBOL.CIRCLE){
                let radius = distance([shapeRef.current._centerX, shapeRef.current._centerY], [x, y]);
                shapeRef.current = {...shapeRef.current, radius}
            }else if(symbol === SYMBOL.RECTANGLE){
                shapeRef.current = {
                    ...shapeRef.current,
                    left: x > shapeRef.current._anchorX ? shapeRef.current._anchorX : x,
                    top: y > shapeRef.current._anchorY ? shapeRef.current._anchorY : y,
                    width: Math.abs(x - shapeRef.current._anchorX), 
                    height: Math.abs(y - shapeRef.current._anchorY)
                }
            } else if(symbol === SYMBOL.POLYGON) {
                let points = obj.get("points");
                points[pointsRef.current.length] = { x, y };
                obj.set({points});
                
                linesRef.current[linesRef.current.length - 1].set({x2: x, y2: y});
            } else if(symbol === SYMBOL.POLYLINE){
                linesRef.current[linesRef.current.length - 1].set({x2: x, y2: y});
            }
            updateShape();
        }
    }, [canvas, obj])
    let onMouseDown = useCallback((options)=>{
        if(obj){
            const {x, y} = options.pointer;
            // 绑定监听器
            let isExist = canvas._objects.some((object)=> object.id === obj.id)
            if(!isExist){
                canvas.add(obj);
                canvas.on("mouse:move", onMouseMove)
                canvas.on("mouse:dblclick", onPolygonOver)
            }

            // 添加初始配置
            if(symbol === SYMBOL.CIRCLE) {
                shapeRef.current = shapeRef.current || {_centerY: y, _centerX: x, top: y, left: x, originX: "center", originY: "center"}
            }else if(symbol === SYMBOL.RECTANGLE){
                shapeRef.current = shapeRef.current || {top: y, left: x, _anchorX: x, _anchorY: y}
            } else if(symbol === SYMBOL.POLYGON) {
                const point = makeCircle({_centerX: x, _centerY: y, left: x - 5, top: y - 5, radius: 5, zIndex: 2, selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                    objectCaching: false})
                const line = makeLine([x, y, x, y], {zIndex:4, selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                    objectCaching: false});
                pointsRef.current = [...pointsRef.current, point];
                linesRef.current  = [...linesRef.current, line];
                
                shapeRef.current = {points: [...pointsRef.current.map(pointer=>({x:pointer._centerX, y:pointer._centerY}))]}
                canvas.add(point, line);
            } else if(symbol === SYMBOL.POLYLINE) {
                const point = makeCircle({_centerX: x, _centerY: y, left: x - 5, top: y - 5, radius: 5, zIndex: 2, selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                    objectCaching: false})
                const line = makeLine([x, y, x, y], {zIndex:4, selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                    objectCaching: false});
                pointsRef.current = [...pointsRef.current, point];
                linesRef.current  = [...linesRef.current, line];
                
                canvas.add(point, line);
            }
            updateShape()
        }
    }, [obj, symbol])

    let updateShape = ()=>{
        obj.setOptions(shapeRef.current || {});
        obj.setCoords();
        canvas.requestRenderAll();
    }

    useEffect(()=>{
        if(symbol){
            let drawObj = null;
            switch (symbol) {
                case SYMBOL.RECTANGLE:
                    drawObj = makeRect({
                        evented: false,
                    })
                    break;
                case SYMBOL.CIRCLE:
                    drawObj = makeCircle({
                        evented: false,
                    })
                    break;
                case SYMBOL.POLYLINE:
                    drawObj = makePolyline()
                    break;
                case SYMBOL.POLYGON:
                    drawObj = makePolygon([], {
                        // selectable: true,
                        // hasBorders: false,
                        // hasControls: true,
                        // evented: true,
                        objectCaching: false
                    })
                    break;
                case SYMBOL.ITEXT:
                    // drawObj = makeText()
                default:
                    break;
            }
            drawObj && setObj(drawObj);
        } else{
            setObj(null)
        }
    }, [symbol])

    useEffect(() => {
        // Tips: 避免在绘制时选中其他obj而产生的bug
        if(obj) {
            canvas.selection = false;
            canvas._objects.forEach(obj => {
                obj.selectable = false;
                obj.evented = false;
                obj.hasControls = false;
            })
        } else if(!obj && canvas){
            canvas.selection = true;
            canvas._objects.forEach(obj => {
                obj.selectable = true;
                obj.evented = true;
                obj.hasControls = true;
            })
        }
        if(canvas && obj) {
            canvas.on("mouse:down", onMouseDown)
        }
        return ()=>{
            canvas?.off("mouse:dblclick", onPolygonOver)
            canvas?.off("mouse:down", onMouseDown)
        }
    }, [canvas, obj])

    // 结束绘制，将各个变量及move事件移除掉；obj变化时effect会移除down等事件
    let endDrawing = ()=>{
        setSymbol(null);
        shapeRef.current = null; // 
        canvas.off("mouse:move", onMouseMove) // 在绘制完成或重复点击绘制按钮时，移除move事件
        canvas.remove(...pointsRef.current, ...linesRef.current)
        pointsRef.current = linesRef.current = [];
        canvas.set("$mode", MODE.NONE)
    };

    return [(symbol)=>{
        // 在绘制过程中，再次点击绘制图形按钮时，将上次绘制的内容及事件情况掉
        if(canvas.get("$mode") === MODE.DRAW) { 
            canvas?.remove(obj)
            canvas?.off("mouse:dblclick", onPolygonOver)
            canvas?.off("mouse:down", onMouseDown)
            endDrawing()
        }
        canvas.set("$mode", MODE.DRAW);
        // 如果再次点击绘制按钮为自己时，需要使用setTimeout重置symbol
        obj?.get("type") === symbol ? setTimeout(()=>{setSymbol(symbol)}) : setSymbol(symbol)
    }]
}