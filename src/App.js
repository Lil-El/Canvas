import React, { useEffect, useMemo, useState } from "React";
import "./App.css"; //  className="toolbar"
import style from "./style/index.scss";
import { SYMBOL, MODE } from './canvas/util';
import { useObjSize, useDrawing, makeLine, makeCircle, makeRect, makePolygon, makeOperateCircle } from './canvas/Draw'
import useRange from "./canvas/Range/useRange";
import { useEditing } from "./canvas/Edit";
import { useDelete } from "./canvas/Delete";
import { useSize } from "./canvas/Size";

export default function App() {
    // PS: let 定义的对象；在useEffect可能无法获取到
    
    const [ canvas, setCanvas ] = useState(null);
    useSize(canvas)
    const [ size ] = useSize(canvas);
    const [ startDrawing ] = useDrawing(canvas);
    useEditing(canvas);
    useDelete(canvas);
    const [ isRange, setRangeStatus ] = useRange(canvas);

    const addSymbol = (type)=>{
        switch(type){
            case SYMBOL.LINE:
                let line = makeLine([0, 0, 200, 200], {
                    id: Date.now(),
                    left: 100,
                    top: 100,
                    stroke: "blue",
                    strokeWidth: 3
                });
                canvas.add(line);
                break;
            case SYMBOL.POLYGON:
                // let path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
                // path.set({ left: 120, top: 120,fill:'red' });
                // canvas.add(path);
                let polygon = makePolygon([
                    {x: 0, y: 0},
                    {x: 100, y: 20},
                    {x: 200, y: 120},
                    {x: 150, y: 140},
                ], {
                    left: 0,
                    top: 0,
                    fill:'red',
                    objectCaching: false,
		            transparentCorners: false,
                });
                canvas.add(polygon);
                break;
            case SYMBOL.RECTANGLE:
                canvas.add(makeRect({
                    left: 200, 
                    top: 200,
                    fill: "green",
                    width: 200,
                    height: 200,
                    id: Date.now(),
                    name: "这是一个气泡标题"
                }));
                break;
            case SYMBOL.CIRCLE:
                canvas.add(makeCircle({
                    left: 100, 
                    top: 100,
                    fill: "red",
                    radius: 100,
                    id: Date.now(),
                    name: "这是一个气泡标题"
                }));
                break;
            case SYMBOL.POLYLINE:
                let polyline = new fabric.Polyline([
                    {x: 0, y: 0},
                    {x: 0, y: 150},
                    {x: 150, y: 150},
                    {x: 150, y: 230}
                ],{
                    left: 100,
                    top: 100,
                    fill: "transparent",
                    stroke: "red",
                    strokeWidth: 3,
                    id: Date.now(),
                    objectCaching: false,
		            transparentCorners: false,
                })
                canvas.add(polyline);
                break;
            default:
                break;
        }
    }

    const addPopup = ()=>{
        const content = makeRect({
            rx: 5,
            ry: 5,
            width: 100,
            height: 60,
            fill: "transparent",
            stroke: "#000000",
        })
        canvas.add(content)
    }

    useEffect(()=>{
        let _canvas = new fabric.Canvas("canvas");
        _canvas.set("$mode", MODE.NONE)
        setCanvas(_canvas);
    }, [])

    return (
        <div className={`${style["flex-inline-item"]}`}>
            <div className={`${style["flex"]} ${style["flex-column"]}`}>
                <button onClick={() => addSymbol(SYMBOL.LINE)}>Add Line</button>
                <button onClick={() => addSymbol(SYMBOL.CIRCLE)}>Add Circle</button>
                <button onClick={() => addSymbol(SYMBOL.RECTANGLE)}>Add Rect</button>
                <button onClick={() => addSymbol(SYMBOL.POLYGON)}>Add Polygon</button>
                <button onClick={() => addSymbol(SYMBOL.POLYLINE)}>Add Polyline</button>
                <button onClick={() => addPopup()}>Add Popup</button>
            </div>
            <div className={`${style["flex-inline-item"]} ${style["flex-column"]}`}>
                <div className={style.toolbar}>
                    <div className={style.toolbar__draw}>
                        <button onClick={() => startDrawing(SYMBOL.RECTANGLE)}>Draw Rect</button>
                        <button onClick={() => startDrawing(SYMBOL.CIRCLE)}>Draw Circle</button>
                        <button onClick={() => startDrawing(SYMBOL.LINE)}>Draw Line</button>
                        <button onClick={() => startDrawing(SYMBOL.POLYLINE)}>Draw Polyline</button>
                        <button onClick={() => startDrawing(SYMBOL.POLYGON)}>Draw Polygon</button>
                        <button onClick={() => setRangeStatus(true)}>Start Machine</button>
                        <button onClick={() => setRangeStatus(false)}>Close Machine</button>
                    </div>
                </div>
                <div className={style.toolbar}>
                    <div className={style.toolbar__draw}>
                        <button></button>
                    </div>
                </div>
                <div>{size && `${size[0]}, ${size[1]}`}</div>
                <canvas id="canvas" width="500" height="400" className={style.canvas}></canvas>
            </div>
        </div>
        
    );
}
