import React, { useEffect, useMemo, useState } from "React";
import "./App.css"; //  className="toolbar"
import style from "./style/index.scss";
import { SYMBOL, MODE } from './canvas/util';

export default function App() {
    // PS: let canvas 定义的对象；在useEffect可能无法获取到

    const [ curMode, setModeType ] = useState(MODE.NONE);
    const [ canvas, setCanvas ] = useState(null);

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
                });
                canvas.add(rect);
                break;
            default:
                break;
        }
    }
    const toggleMode = (mode) => {
        if(mode in MODE) setModeType(mode);
        // canvas.on('mouse:down', function(options) {
        //     console.log(options);
        //     console.log(options.e.clientX, options.e.clientY)
        // })
    }
    useEffect(()=>{
        setCanvas(new fabric.Canvas("canvas"))
    }, [])
    
    useEffect(()=>{
        canvas && (canvas.selection = false);
    }, [canvas])

    useEffect(()=>{
        let startX, startY = 0;
        let endX, endY = 0;

        switch(curMode){
            case MODE.DRAW:
                let drawing = null;
                let rect = new fabric.Rect({
                    left: 100,
                    top: 100,
                    fill: "green",
                    width: 10,
                    height: 10,
                })
                canvas.add(rect);
                canvas.on('mouse:down', function(options) {
                    drawing = true;
                    const {x, y} = options.pointer;
                    [rect.left, rect.top] = [startX, startY] = [x, y];
                    canvas.renderAll();
                    console.log(rect.aCoords);
                    // rect.setCoords();
                })
                canvas.on('mouse:move', function(options) {
                    if(drawing != true) return void 0;
                    const {x, y} = options.pointer;
                    // .set({})   .set("width", xxx)
                    rect.setOptions({width: Math.abs(x - startX), height: Math.abs(y - startY)})
                    canvas.renderAll();
                })
                canvas.on('mouse:up', function() {
                    drawing = false;
                    rect.setCoords();
                    canvas.off("mouse:down")
                    canvas.off("mouse:move")
                    canvas.off("mouse:up")
                })
                break;
            default: 
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
                <canvas id="canvas" width="500" height="400" className={style.canvas}></canvas>
            </div>
        </div>
        
    );
}
