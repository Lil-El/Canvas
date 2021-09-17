import React, { useEffect, useMemo, useState } from "React";
import "./App.css"; //  className="toolbar"
import style from "./style/index.scss";
import { SYMBOL, MODE } from './canvas/util';
import { useObjSize, useDrawing } from './hooks'

export default function App() {
    // PS: let canvas 定义的对象；在useEffect可能无法获取到
    const [ curMode, setModeType ] = useState(MODE.NONE);
    const [ canvas, setCanvas ] = useState(null);
    const [ current, size ] = useObjSize(canvas);
    const [ startDrawing, endDrawing ] = useDrawing(canvas);

    const addSymbol = (type)=>{
        switch(type){
            case SYMBOL.POLYGON:
                var path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
                path.set({ left: 120, top: 120,fill:'red' });
                canvas.add(path);
                break;
            case SYMBOL.RECTANGLE:
                let rect = new fabric.Rect({
                    left: 200, 
                    top: 200,
                    fill: "green",
                    width: 200,
                    height: 200,
                    id: Date.now()
                });
                // setCurrent(rect)
                canvas.add(rect);
                break;
            default:
                break;
        }
    }
    const toggleMode = (mode) => {
        if(mode in MODE) setModeType(mode);
    }
    useEffect(()=>{
        setCanvas(new fabric.Canvas("canvas"))
    }, [])
    
    useEffect(()=>{
        canvas && (canvas.selection = false);
    }, [canvas])

    useEffect(()=>{
        switch(curMode){
            case MODE.DRAW:
                startDrawing(new fabric.Rect({
                    id: Date.now(),
                    left: 100,
                    top: 100,
                    fill: "green",
                    width: 10,
                    height: 10,
                }))
                break;
            default: 
                endDrawing();
                break;
        }
    }, [curMode])

    return (
        <div className={`${style["flex-inline-item"]}`}>
            <div className={`${style["flex"]} ${style["flex-column"]}`}>
                <button onClick={() => addSymbol(SYMBOL.LINE)}>Draw Line</button>
                <button onClick={() => addSymbol(SYMBOL.CIRCLE)}>Draw Circle</button>
                <button onClick={() => addSymbol(SYMBOL.RECTANGLE)}>Draw Rect</button>
                <button onClick={() => addSymbol(SYMBOL.POLYGON)}>Draw Polygon</button>
            </div>
            <div className={`${style["flex-inline-item"]} ${style["flex-column"]}`}>
                <div className={style.toolbar}>
                    <div className={style.toolbar__draw}>
                        <button onClick={() => toggleMode(MODE.DRAW)}>Draw</button>
                        <button onClick={() => toggleMode(MODE.EDIT)}>Edit</button>
                    </div>
                </div>
                <div>{size && `${size.width}, ${size.height}`}</div>
                <canvas id="canvas" width="500" height="400" className={style.canvas}></canvas>
            </div>
        </div>
        
    );
}
