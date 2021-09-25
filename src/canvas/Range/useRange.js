import { useState, useEffect, useCallback } from "react";
import { getCoordOfVertical, distance, verticalDistance } from "../../util/math"

export default function (canvas) {
    const [status, setStatus] = useState(false)
    const onRange = useCallback((ev)=>{
        const [shape] = canvas.getObjects();
        if (ev.target) return void shape.fire("play");
        let {x, y} = ev.pointer;
        const {tl, tr, br, bl} = shape.oCoords;
        let points = [tl, tr, br, bl]
        // 设置 offsetValue = 10px;
        // 1. 先判断触发点与顶点的距离
        for(let i = 0; i < points.length; i++) {
            let {x: pX, y: pY} = points[i];
            if(distance({x, y}, {x: pX, y: pY}) <= 10) return void shape.fire("play");
        }
        // true : 位置 <= 10 ；再判断是否在线上 
        // 2. 判断触发点与各个边的垂直距离
        for(let i = 0; i < points.length; i++) {
            let {x: curX, y: curY} = points[i];
            let {x: nxtX, y: nxtY} = points[(i + 1) === points.length ? 0 : (i + 1)];
            if(verticalDistance({x, y}, {x: curX, y: curY}, {x: nxtX, y: nxtY}) <= 10) {
                console.log("vertical:", verticalDistance({x, y}, {x: curX, y: curY}, {x: nxtX, y: nxtY}));
                let [xx, yy, isOnLine] = getCoordOfVertical({x, y}, {x: curX, y: curY}, {x: nxtX, y: nxtY})
                if(isOnLine) return void shape.fire("play");
            }
        }
    }, [canvas])

    useEffect(() => {
        if(status && canvas) canvas.on("mouse:down", onRange)
        return () => {
            canvas?.off("mouse:down", onRange)
        }
    }, [status, canvas])

    return [status, setStatus]
}
