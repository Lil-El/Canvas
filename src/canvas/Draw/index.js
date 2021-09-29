import { distance } from "../../util/math";
import { useCallback, useEffect, useState, useRef } from "react";
import { MODE, SYMBOL } from "../util/index"
import { makeCircle } from "./Circle";
import { makeRect } from "./Rectangle";
import { makePolygon } from "./Polygon";
import { makePolyline } from "./Polyline";
import { makeLine } from "./Line";

export function useDrawing(canvas){
    let [symbol, setSymbol] = useState(null);
    let [obj, setObj] = useState(null);
    let shapeRef = useRef({});

    let pointsRef = useRef([]);
    let linesRef = useRef([]);

    let onPolygonOver = useCallback(()=>{
        canvas.off("mouse:move", onMouseMove)
        canvas.remove(...pointsRef.current, ...linesRef.current)
        shapeRef.current = {points: [...pointsRef.current.map(pointer=>({x:pointer._centerX, y:pointer._centerY}))]}
        let copyObj;
        if(obj.get("type") === SYMBOL.POLYLINE.toLowerCase()) {
            copyObj = makePolyline(shapeRef.current.points)
        } else if(obj.get("type") === SYMBOL.POLYGON.toLowerCase()) {
            copyObj = makePolygon(shapeRef.current.points);
        }
        canvas.add(copyObj);
        canvas.remove(obj);
        pointsRef.current = linesRef.current = [];
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
            }else if(symbol === SYMBOL.LINE){
                shapeRef.current = {...shapeRef.current, x2: x, y2: y}
            } else if(symbol === SYMBOL.POLYGON) {
                let points = obj.get("points");
                points[pointsRef.current.length] = { x, y };
                obj.set({points});
                
                linesRef.current[linesRef.current.length - 1].set({x2: x, y2: y});
            } else if(symbol === SYMBOL.POLYLINE){
                // let points = obj.get("points");
                // points[pointsRef.current.length] = { x, y };
                // obj.set({points});
                
                linesRef.current[linesRef.current.length - 1].set({x2: x, y2: y});
            }
            updateShape();
        }
    }, [canvas, obj])
    let onMouseDown = useCallback((options)=>{
        if(obj){    
            const {x, y} = options.pointer;
            // 绑定监听器
            if(symbol === SYMBOL.POLYGON || symbol === SYMBOL.POLYLINE){
                let isExist = canvas._objects.some((object)=> object.id === obj.id)
                console.log(canvas._objects);
                if(!isExist){
                    canvas.add(obj);
                    canvas.on("mouse:move", onMouseMove)
                    canvas.on("mouse:dblclick", onPolygonOver)
                }
            }else{
                canvas.add(obj);
                canvas.on("mouse:move", onMouseMove)
            }
            // 添加初始配置
            if(symbol === SYMBOL.CIRCLE) {
                shapeRef.current = {_centerY: y, _centerX: x, top: y, left: x, originX: "center", originY: "center"}
            }else if(symbol === SYMBOL.RECTANGLE){
                shapeRef.current = {top: y, left: x, _anchorX: x, _anchorY: y}
            } else if(symbol === SYMBOL.LINE) {
                shapeRef.current = {x1: x, y1: y}
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
    let onMouseUp = useCallback(()=>{
        if(symbol === SYMBOL.POLYGON || symbol === SYMBOL.POLYLINE) return void 0;
        if(obj){
            endDrawing();
            obj.setCoords();
            canvas.off("mouse:move", onMouseMove)
        }
    }, [obj, symbol])

    let updateShape = ()=>{
        obj.setOptions(shapeRef.current);
        obj.setCoords();
        canvas.requestRenderAll();
    }

    useEffect(()=>{
        if(symbol){
            let drawObj = null;
            switch (symbol) {
                case SYMBOL.RECTANGLE:
                    drawObj = makeRect()
                    break;
                case SYMBOL.CIRCLE:
                    drawObj = makeCircle()
                    break;
                case SYMBOL.LINE:
                    drawObj = makeLine()
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
            canvas.on("mouse:up", onMouseUp)
        }
        return ()=>{
            canvas?.off("mouse:dblclick", onPolygonOver)
            canvas?.off("mouse:down", onMouseDown)
            canvas?.off("mouse:up", onMouseUp)
        }
    }, [canvas, obj])

    let endDrawing = ()=>{
        setSymbol(null);
        canvas.set("$mode", MODE.NONE)
    };

    return [(symbol)=>{
        canvas.set("$mode", MODE.DRAW);
        setSymbol(symbol);
    }]
}

export * from './Circle'
export * from './Line'
export * from './Polygon'
export * from './Polyline'
export * from './Rectangle'