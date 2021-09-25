import React, { useEffect, useMemo, useState } from "React";
import "./App.css"; //  className="toolbar"
import style from "./style/index.scss";
import { SYMBOL, MODE } from './canvas/util';
import { useObjSize, useDrawing } from './canvas/Draw'
import useRange from "./canvas/Range/useRange";

// TODO: 文字是否Dom还是canvas展示？如何设置文字展示锚点位置？
export default function App() {
    // PS: let canvas 定义的对象；在useEffect可能无法获取到
    const [ curMode, setModeType ] = useState(MODE.NONE);
    const [ canvas, setCanvas ] = useState(null);
    const [ current, size ] = useObjSize(canvas);
    const [ startDrawing, endDrawing ] = useDrawing(canvas);
    const [ isRange, setRangeStatus ] = useRange(canvas);

    const addSymbol = (type)=>{
        switch(type){
            case SYMBOL.LINE:
                let line = new fabric.Line([0, 0, 200, 200], {
                    id: Date.now(),
                    left: 100,
                    top: 100,
                    stroke: "blue",
                    strokeWidth: 3
                });
                canvas.add(line)
            case SYMBOL.POLYGON:
                // let path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
                // path.set({ left: 120, top: 120,fill:'red' });
                // canvas.add(path);
                let polygon = new fabric.Polyline([
                    {x: 0, y: 0},
                    {x: 100, y: 20},
                    // {x: 150, y: 140},
                    // {x: 200, y: 120}
                ], {
                    left: 0, 
                    top: 0,
                    fill:'red',
                    width: 100,
                    height: 100
                });
                canvas.add(polygon);
                break;
            case SYMBOL.RECTANGLE:
                let rect = new fabric.Rect({
                    left: 200, 
                    top: 200,
                    fill: "green",
                    width: 200,
                    height: 200,
                    id: Date.now(),
                    name: "这是一个气泡标题"
                });
                rect.on("play", ()=>{
                    console.log('play');
                })
                // setCurrent(rect)
                canvas.add(rect);
                break;
            case SYMBOL.CIRCLE:
                let circle = new fabric.Circle({
                    left: 100, 
                    top: 100,
                    fill: "red",
                    radius: 100,
                    id: Date.now(),
                    name: "这是一个气泡标题"
                })
                canvas.add(circle);
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
                    name: "这是一个气泡标题"
                })
                canvas.add(polyline);
                break;
            default:
                break;
        }
    }
    const toggleMode = (mode, shape) => {
        if(mode in MODE) setModeType(`${mode}_${shape}`);
    }
    useEffect(()=>{
        setCanvas(new fabric.Canvas("canvas"));
    }, [])
    
    const drawing = (symbol)=>{
        startDrawing(symbol)
    }

    useEffect(()=>{
        canvas && (canvas.selection = false);
    }, [canvas])

    useEffect(()=>{
        switch(curMode){
            case `${MODE.DRAW}_${SYMBOL.POLYGON}`:
                startDrawing(new fabric.Line([0, 0, 0, 0], {
                    id: Date.now(),
                    left: 0,
                    top: 0,
                    stroke: "blue",
                    strokeWidth: 3
                }))
                break;
            default: 
                endDrawing();
                break;
        }
    }, [canvas, curMode])

    let getAll = ()=>{
        console.log('getAll');
        // let element = document.elementFromPoint(700, 400);
        // console.log(element)
    }
    
    return (
        <div className={`${style["flex-inline-item"]}`}>
            <div className={`${style["flex"]} ${style["flex-column"]}`}>
                <button onClick={() => addSymbol(SYMBOL.LINE)}>Add Line</button>
                <button onClick={() => addSymbol(SYMBOL.CIRCLE)}>Add Circle</button>
                <button onClick={() => addSymbol(SYMBOL.RECTANGLE)}>Add Rect</button>
                <button onClick={() => addSymbol(SYMBOL.POLYGON)}>Add Polygon</button>
                <button onClick={() => addSymbol(SYMBOL.POLYLINE)}>Add Polyline</button>
            </div>
            <div className={`${style["flex-inline-item"]} ${style["flex-column"]}`}>
                <div className={style.toolbar}>
                    <div className={style.toolbar__draw}>
                        <button onClick={() => drawing(SYMBOL.RECTANGLE)}>Draw Rect</button>
                        <button onClick={() => drawing(SYMBOL.CIRCLE)}>Draw Circle</button>
                        <button onClick={() => toggleMode(MODE.EDIT)}>Edit</button>
                        <button onClick={() => setRangeStatus(true)}>Start Machine</button>
                        <button onClick={() => setRangeStatus(false)}>Close Machine</button>
                    </div>
                </div>
                <div className={style.toolbar}>
                    <div className={style.toolbar__draw}>
                        <button onClick={getAll}>getAll</button>
                    </div>
                </div>
                <div>{size && `${size.width}, ${size.height}`}</div>
                <canvas id="canvas" width="500" height="400" className={style.canvas}></canvas>
            </div>
        </div>
        
    );
}
