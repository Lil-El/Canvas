import React, { useEffect, useState } from "React";
// import "./App.scss";  className="toolbar"
import style from "./style/index.scss";
import { DRAW_TYPE } from './canvas/util';

export default function App() {
    const [ drawType, setDrawType ] = useState(DRAW_TYPE.NONE);

    const toggleType = (type)=> {
        if(type in DRAW_TYPE) setDrawType(type);
    }

    useEffect(()=>{
        console.log('type is changed: ', drawType);
    }, [drawType])

    return (
        <div>
            <div className={style.toolbar}>
                <div className={style.toolbar__draw}>
                    <button onClick={() => toggleType("Line")}>Draw Line</button>
                    <button onClick={() => toggleType("Circle")}>Draw Circle</button>
                    <button onClick={() => toggleType("Rectangle")}>Draw Rect</button>
                    <button onClick={() => toggleType("Polygon")}>Draw Polygon</button>
                </div>
            </div>
            <canvas class={style.canvas}></canvas>
        </div>
    );
}
