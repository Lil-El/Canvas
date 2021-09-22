import React, { useEffect, useMemo, useState } from "React";
import "./App.css"; //  className="toolbar"
import style from "./style/index.scss";
import { SYMBOL, MODE } from './canvas/util';
import { useObjSize, useDrawing } from './hooks'
import { getCoordOfVertical, distance, verticalDistance } from "./util/math"

// TODO: 判断点位是否在范围内？
// 文字是否Dom还是canvas展示？如何设置文字展示锚点位置？
export default function App() {
    // PS: let canvas 定义的对象；在useEffect可能无法获取到
    const [ curMode, setModeType ] = useState(MODE.NONE);
    const [ canvas, setCanvas ] = useState(null);
    const [ machineStatus, setMachineStatus ] = useState(false);
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
                    id: Date.now(),
                    name: "这是一个气泡标题"
                });
                rect.on("play", ()=>{
                    console.log('play');
                })
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
        setCanvas(new fabric.Canvas("canvas"));
        
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
    }, [canvas, curMode])

    let getAll = ()=>{
        console.log('getAll');
        canvas?.forEachObject((shape, index, all)=>{
            shape.fire("play")
        }, canvas);
        // let element = document.elementFromPoint(700, 400);
        // console.log(element)
    }
    useEffect(()=>{
        if(machineStatus && canvas){
            canvas.on("mouse:down", (ev)=>{
                let isNear = false;
                const [objects] = canvas.getObjects();
                if (ev.target) return void console.log("is near");
                let {x, y} = ev.pointer;
                const {tl, tr, br, bl} = objects.oCoords;
                // offsetValue = 10px;
                let allDistance = [distance({x, y}, {x: tl.x, y: tl.y}), distance({x, y}, {x: tr.x, y: tr.y}), distance({x, y}, {x: bl.x, y: bl.y}), distance({x, y}, {x: br.x, y: br.y})]
                console.log(allDistance);
                for(let i = 0; i< allDistance.length; i++) {
                    let curDistance = allDistance[i];
                    if(curDistance <= 10) {
                        return void console.log("is near");
                    }
                }
                // true : 位置 <= 10 ；再判断是否在线上 
                
                let allVDistance = [verticalDistance({x, y}, {x: tl.x, y: tl.y}), verticalDistance({x, y}, {x: tr.x, y: tr.y}), verticalDistance({x, y}, {x: bl.x, y: bl.y}), verticalDistance({x, y}, {x: br.x, y: br.y})]
                console.log(allVDistance);
                for(let i = 0; i< allVDistance.length; i++) {
                    let curDistance = allVDistance[i];
                    if(curDistance <= 10) {
                        // getCoordOfVertical([x, y], [tl.x, tl.y], [tr.x, tr.y])

                        return void console.log("is near");
                    }
                }
                console.log('so fast');
                
            })
        }
    }, [machineStatus, canvas])
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
                        <button onClick={() => setMachineStatus(true)}>Start Machine</button>
                        <button onClick={() => setMachineStatus(false)}>Close Machine</button>
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
