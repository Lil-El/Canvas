import React, { useEffect, useMemo, useState } from "React";
import "./App.css"; //  className="toolbar"
import style from "./style/index.scss";
import { DRAW_TYPE } from './canvas/util';

export default function App() {
    const [ drawType, setDrawType ] = useState(DRAW_TYPE.NONE);

    const toggleType = (type) => {
        console.log(type);
        if(type in DRAW_TYPE) setDrawType(type);
    }
    useEffect(()=>{
        let canvas = new fabric.Canvas("canvas");
        let rect = new fabric.Rect({  
            left: 200, //距离左边的距离  
            top: 200, //距离上边的距离  
            fill: "green", //填充的颜色  
            width: 200, //矩形宽度  
            height: 200, //矩形高度  
        });
        canvas.add(rect);
    }, [])

    useEffect(()=>{
        console.log('type is changed: ', drawType);
    }, [drawType])

    return (
        <div className={`${style["flex-inline-item"]} ${style["flex-column"]}`}>
            <div className={style.toolbar}>
                <div className={style.toolbar__draw}>
                    <button onClick={() => toggleType(DRAW_TYPE.LINE)}>Draw Line</button>
                    <button onClick={() => toggleType(DRAW_TYPE.CIRCLE)}>Draw Circle</button>
                    <button onClick={() => toggleType(DRAW_TYPE.RECTANGLE)}>Draw Rect</button>
                    <button onClick={() => toggleType(DRAW_TYPE.POLYGON)}>Draw Polygon</button>
                </div>
            </div>
            <canvas id="canvas" width="500" height="400" className={style.canvas}></canvas>
        </div>
    );
}
