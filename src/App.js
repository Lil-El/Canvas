import React, { useEffect, useState } from "React";
import "./App.css"; //  className="toolbar"
import style from "./style/index.scss";
import { SYMBOL, MODE } from './canvas/util';
import { useObjSize, makeLine, makeCircle, makeRect, makePolygon, makeOperateCircle } from './canvas/Symbol';
import useRange from "./canvas/Range/useRange";
import { useEditing } from "./canvas/Edit";
import { useKeydown } from "./canvas/Keydown";
import { useSize } from "./canvas/Size";
import { makePopup } from "./canvas/Popup";
import {useDrawing} from "./canvas/Draw"
import useCurrent from "./canvas/useCurrent";

export default function App() {
    // PS: let 定义的对象；在useEffect可能无法获取到
    const [dataURL, setDataURL] = useState("")

    const [ canvas, setCanvas ] = useState(null);
    const [current] = useCurrent(canvas)
    useSize(canvas)
    const [ size ] = useSize(canvas);
    const [ startDrawing ] = useDrawing(canvas);
    useEditing(canvas);
    useKeydown(canvas);
    const [ isRange, setRangeStatus ] = useRange(canvas);

    const addSymbol = (type)=>{
        switch(type){
            case SYMBOL.POLYGON:
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
            case SYMBOL.ITEXT:
                let p = new fabric.IText("", {
                    stroke: "red",
                    fill: "blue",
                    fontSize: 18,
                    lineHeight: 1,
                    fontWeight: "bold",
                    hasControls: false,
                    objectCaching: false
                })
                canvas.add(p)
                let text = "水，电费水电费水电费规划局规划局规划局" // 不支持输入空格
                let next = (i)=>{
                    if(i >= text.length) return void p.set("text", text);
                    setTimeout(()=>{
                        let space = (i-1) < 0 ? "" : " ".repeat(i*4)
                        let word = text[i];
                        p.set("text", space + word);
                        canvas.requestRenderAll()
                        // p.animate('opacity', '1', {
                        //     from: "0",
                        //     duration: 500,
                        //     onChange: canvas.requestRenderAll.bind(canvas),
                        // });
                        next(i+1)
                    }, 500)
                }
                next(0);
            default:
                break;
        }
    }

    const addPopup = ()=>{
        const path = makePopup(canvas)
        canvas.add(path);
    }
    const exportPNG = ()=>{
        let group = new fabric.Group();
        canvas.forEachObject((obj)=>{
            obj.get("id") && group.addWithUpdate(obj)
        })
        if(!group.getObjects().length) return void group.destroy();
        canvas.add(group);
        setDataURL(canvas.toDataURL({
            format: "png",
            left: group.left,
            top: group.top,
            width: group.width,
            height: group.height
        }));
        group.destroy();
        canvas.remove(group);
    }
    const showAll = ()=>{
        console.log(canvas.getObjects());
    }
    const toTop = ()=>{
        current.bringToFront();
    }
    useEffect(()=>{
        let _canvas = new fabric.Canvas("canvas");
        _canvas.set("$mode", MODE.NONE)
        setCanvas(_canvas);
    }, [])

    return (
        <div className={`${style["flex-inline-item"]}`}>
            <div className={`${style["flex"]} ${style["flex-column"]}`}>
                <button onClick={() => addSymbol(SYMBOL.ITEXT)}>Add IText</button>
                <button onClick={() => addSymbol(SYMBOL.CIRCLE)}>Add Circle</button>
                <button onClick={() => addSymbol(SYMBOL.RECTANGLE)}>Add Rect</button>
                <button onClick={() => addSymbol(SYMBOL.POLYGON)}>Add Polygon</button>
                <button onClick={() => addSymbol(SYMBOL.POLYLINE)}>Add Polyline</button>
                <button onClick={() => addPopup()}>Add Popup</button>
            </div>
            <img src={dataURL} />
            <div className={`${style["flex-inline-item"]} ${style["flex-column"]}`}>
                <div className={style.toolbar}>
                    <div className={style.toolbar__draw}>
                        <button onClick={() => startDrawing(SYMBOL.RECTANGLE)}>Draw Rect</button>
                        <button onClick={() => startDrawing(SYMBOL.CIRCLE)}>Draw Circle</button>
                        <button onClick={() => startDrawing(SYMBOL.POLYLINE)}>Draw Polyline</button>
                        <button onClick={() => startDrawing(SYMBOL.POLYGON)}>Draw Polygon</button>
                        <button onClick={() => startDrawing(SYMBOL.ITEXT)}>Draw Text</button>
                        <button onClick={() => setRangeStatus(true)}>Start Machine</button>
                        <button onClick={() => setRangeStatus(false)}>Close Machine</button>
                    </div>
                </div>
                <div className={style.toolbar}>
                    <div className={style.toolbar__draw}>
                        <button onClick={exportPNG}>export png</button>
                        <button onClick={showAll}>show all</button>
                        <button onClick={toTop}>to Top</button>
                    </div>
                </div>
                <div>{size && `${size[0]}, ${size[1]}`}</div>
                <canvas id="canvas" width="500" height="400" className={style.canvas}></canvas>
            </div>
        </div>
        
    );
}
