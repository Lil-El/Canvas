import { useMemo, useState } from "react"
import {makePath} from "../Symbol/Path"

/**
 * @description 通生成popup的path的轨迹
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
// width = contentWidth + 2 * borderRadius
function genPopupPath(target){
    // TODO: 判断 offset + angleHeigh * 2  要 小于 width
    // 绘制顺序：上 右 下 左
    const {width: originWidth, height: originHeight, scaleX, scaleY, radius, angleHeight, angleOffset, anglePosition} = target;
    // height，width 是总体的高度、宽度，在计算是需要减去angleHeight
    let width = originWidth * scaleX - (["left", "right"].includes(anglePosition) ? angleHeight : 0);
    let height = originHeight * scaleY - (["top", "bottom"].includes(anglePosition) ? angleHeight : 0);
    let contentTopWidth = `
        M 0,0
        ${
            anglePosition === "top" ? 
            `
                l ${angleOffset} 0
                l ${angleHeight} -${angleHeight}
                l ${angleHeight} ${angleHeight}
            ` : ""
        }
        L ${width - 2 * radius}, 0
    `;
    let topRight = `
        C ${width - 2 * radius}, 0 ${width - radius}, 0 ${width - radius} ${radius}
    `;
    let contentRightHeight = `
        ${
            anglePosition === "right" ? 
            `
                v ${radius + angleOffset}
                l ${angleHeight} ${angleHeight}
                l -${angleHeight} ${angleHeight}
            ` : ""
        }
        V ${height - radius}
    `
    let bottomRight = `
        c 0, 0 0, ${radius} -${radius}, ${radius}
    `
    let contentBottomWidth = `
        ${
            anglePosition === "bottom" ? 
            `
                l -${width - radius - angleOffset - 2 * angleHeight} 0
                l -${angleHeight} ${angleHeight}
                l -${angleHeight} -${angleHeight}
            ` : ""
        }
        H 0
    `
    let bottomLeft = `
        q -${radius}, 0 -${radius}, -${radius}
    `
    let contentLeftHeight = `
        ${
            anglePosition === "left" ? 
            `
                V ${radius + angleOffset + 2 * angleHeight}
                l -${angleHeight} -${angleHeight}
                l ${angleHeight} -${angleHeight}
            ` : ""
        }
        V ${radius}
    `
    let topLeft = `
        C -${radius}, ${radius} -${radius}, 0 0, 0
    `
    return contentTopWidth+ topRight + contentRightHeight + bottomRight + contentBottomWidth + bottomLeft + contentLeftHeight + topLeft
}

export const makePopup = (canvas)=>{
    const borderRadius = 10;
    const defaultOptions = {
        top: 0,
        left: 0,
        width: 200,
        height: 100,
        scaleX: 1,
        scaleY: 1,

        radius: borderRadius,
        angleHeight: 10,
        angleOffset: 20,
        anglePosition: "left", // bottom left right top
    }

    const reMakePopup = (target)=>{
        console.log(target);
        const path = makePath(
            genPopupPath(target), 
            {
                left: target.left,
                top: target.top,
                width: target.width,
                height: target.height,
                radius: target.radius,
                angleHeight: target.angleHeight,
                anglePosition: target.anglePosition,
                angleOffset: target.angleOffset,
                objectCaching: false,
                lockRotation: true,
                lockScalingFlip: true,
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