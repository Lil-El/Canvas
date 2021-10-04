import { useEffect } from "react";
import useCurrent from "../useCurrent";
import { MODE, SYMBOL } from "../util";

export const useEditing = (canvas) => {
    const [current] = useCurrent(canvas);
    
    useEffect(()=>{
        // 返回可控制点的位置：初始、移动都执行
        function polygonPositionHandler(dim, finalMatrix, fabricObject) {
            // polyline 初始时的中心点处于canvas左上顶角处。通过pathOffset移动至了 当前的left、top位置。
            // 那么此时的transformMatrix（2 * 3矩阵-2行3列）为
            // [ 1 0 pathOffsetX 
            //   0 1 pathOffsetY ]
            let x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x);
            let y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
            console.log("初始点：", x, y);
            console.log("偏移量：", fabricObject.pathOffset.x, fabricObject.pathOffset.y);
            console.log("matrix：", fabricObject.calcTransformMatrix());
            console.log(fabric.util.transformPoint( { x, y },
                fabric.util.multiplyTransformMatrices(
                    fabricObject.canvas.viewportTransform,
                    fabricObject.calcTransformMatrix()
                )
            ));
            return fabric.util.transformPoint( { x, y },
                fabric.util.multiplyTransformMatrices( // viewport不设置；结果就是fabricObject.calcTransformMatrix
                    fabricObject.canvas.viewportTransform,
                    fabricObject.calcTransformMatrix() // fabricObject在坐标轴中心，经过matrix后才是展示的样子
                )
            );
        }
        // 修改点的位置
        function actionHandler(eventData, transform, x, y) {
            var polygon = transform.target,
                currentControl = polygon.controls[polygon.__corner], //__corner：p0 p1 p2 ;controls = {p0:{}, p1:{}, p2:{}}
                mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center');
            // mouseLocalPosition: 以object中心为坐标轴原点0,0； x,y相对于原点的坐标位置
            console.log(polygon.__corner, currentControl, mouseLocalPosition);
            var polygonBaseSize = polygon._getNonTransformedDimensions(), // width + strokeWidth
                    size = polygon._getTransformedDimensions(0, 0),       // width * scaleX/Y
                    finalPointPosition = {
                        x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
                        y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
                    };
            console.log(polygonBaseSize, size);
            polygon.points[currentControl.pointIndex] = finalPointPosition;
            return true;
        }
        // 一个点被拖动时才执行；返回true就实时展示位置
        function anchorWrapper(anchorIndex, fn) {
          return function(eventData, transform, x, y) {
            var fabricObject = transform.target,
                absolutePoint = fabric.util.transformPoint({
                    x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
                    y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
                }, fabricObject.calcTransformMatrix());
            // console.log("起始位置：", anchorIndex, absolutePoint);
            // console.log("当前位置：", x, y);
            var actionPerformed = fn(eventData, transform, x, y);
            // 以下代码：修改object的border
            var newDim = fabricObject._setPositionDimensions({}),
                polygonBaseSize = fabricObject._getNonTransformedDimensions(),
                newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
                    newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
            fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
            return actionPerformed;
          }
        }
        if (current && (current.get("type") === SYMBOL.POLYLINE || current.get("type") === SYMBOL.POLYGON )) {
            canvas?.on("mouse:dblclick", ()=>{
                canvas.set("$mode", MODE.EDIT);
                current.cornerStyle = 'circle';
                current.cornerColor = 'blue';
                current.hasBorders  = false;
                current.edit        = true;
                current.controls = current.points.reduce(function(acc, point, index) {
                    acc['p' + index] = new fabric.Control({
                        positionHandler: polygonPositionHandler,
                        actionHandler: anchorWrapper(index > 0 ? index - 1 : (current.points.length - 1), actionHandler),
                        actionName: 'modifyPolygon',
                        pointIndex: index
                    });
                    return acc;
                }, {});
                canvas.requestRenderAll();
            })
        }
        return ()=>{
            if(current) {
                canvas.set("$mode", MODE.NONE)
                current.cornerStyle = fabric.Object.prototype.cornerStyle;
                current.cornerColor = fabric.Object.prototype.cornerColor;
                current.controls = fabric.Object.prototype.controls;
                current.edit = false;
                current.hasBorders = true;
                canvas.requestRenderAll();
            }
            canvas?.off("mouse:dblclick");
        }
    }, [canvas, current])
}