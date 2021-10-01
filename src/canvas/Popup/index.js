import { useMemo, useState } from "react"
import {makePath} from "../Symbol/Path"

/**
 * @param {*} width 
 * @param {*} height 
 * @param {*} radius 
 * @param {*} halfOfAngleWidth 
 * @returns String 
 * @description 通过参数宽、高、圆角、等生成popup的path的轨迹
 */
/**
 * M 0,0
    L ${width - 2 * radius}, 0
    C ${width - 2 * radius}, 0 ${width - radius}, 0 ${width - radius} ${radius}
    L ${width - radius} ${height - radius}
    c 0, 0 0, ${radius} -${radius}, ${radius}
    c 0, 0 -${width - 3 * radius - halfOfAngleWidth * 2 }, 0 -${width - 3 * radius - halfOfAngleWidth * 2 }, 0
    l -${halfOfAngleWidth}, ${halfOfAngleWidth}
    l -${halfOfAngleWidth} -${halfOfAngleWidth}
    L 0, ${height}
    c 0, 0 -${radius}, 0 -${radius}, -${radius}
    l 0, -${height - 2 * radius}
    C -${radius}, ${radius} -${radius}, 0 0, 0
    */
function genPopupPath(width, height, radius, angleWidth){
    let halfOfAngleWidth = angleWidth / 2;
    return `
        M 0,0
        L ${width - 2 * radius}, 0
        C ${width - 2 * radius}, 0 ${width - radius}, 0 ${width - radius} ${radius}
        V ${height - radius}
        c 0, 0 0, ${radius} -${radius}, ${radius}
        c 0, 0 -${width - 3 * radius - halfOfAngleWidth * 2 }, 0 -${width - 3 * radius - halfOfAngleWidth * 2 }, 0
        l -${halfOfAngleWidth}, ${halfOfAngleWidth}
        l -${halfOfAngleWidth} -${halfOfAngleWidth}
        H 0
        q -${radius}, 0 -${radius}, -${radius}
        v -${height - 2 * radius}
        C -${radius}, ${radius} -${radius}, 0 0, 0
    `
}

export const makePopup = (canvas)=>{
    const defaultOptions = {
        top: 0,
        left: 0,
        width: 200,
        height: 100 + 10,
        scaleX: 1,
        scaleY: 1,
        radius: 20,
        angleWidth: 20
    }

    const reMakePopup = (target)=>{
        const path = makePath(
            genPopupPath(target.width * target.scaleX, target.height * target.scaleY - target.angleWidth / 2, target.radius, target.angleWidth), 
            {
                left: target.left,
                top: target.top,
                objectCaching: false,
                lockRotation: true,
                radius: target.radius,
                angleWidth: target.angleWidth
            }
        )

        path.on("modified", ({target, action})=>{
            if(action.includes("scale")) {
                const newPath = reMakePopup(target);
                target.off("modified");
                canvas.remove(target);
                canvas.add(newPath);
            }
        })

        return path;
    }

    return reMakePopup(defaultOptions);
}