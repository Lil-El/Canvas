import { useEffect } from "react";
import useCurrent from "../useCurrent";
import { MODE, SYMBOL } from "../util";

export const useEditing = (canvas) => {
    const [current] = useCurrent(canvas);
    
    useEffect(()=>{
        function polygonPositionHandler(dim, finalMatrix, fabricObject) {
            let x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x);
            let y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
            console.log(this.pointIndex, fabricObject.points[this.pointIndex].x, fabricObject.pathOffset.x);
            console.log(this.pointIndex, fabricObject.points[this.pointIndex].y, fabricObject.pathOffset.y);
            return fabric.util.transformPoint( { x, y },
                fabric.util.multiplyTransformMatrices(
                    fabricObject.canvas.viewportTransform,
                    fabricObject.calcTransformMatrix()
                )
            );
        }
        function actionHandler(eventData, transform, x, y) {
            var polygon = transform.target,
                currentControl = polygon.controls[polygon.__corner],
                mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
            polygonBaseSize = polygon._getNonTransformedDimensions(),
                    size = polygon._getTransformedDimensions(0, 0),
                    finalPointPosition = {
                        x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
                        y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
                    };
            polygon.points[currentControl.pointIndex] = finalPointPosition;
            return true;
        }
        function anchorWrapper(anchorIndex, fn) {
          return function(eventData, transform, x, y) {
            var fabricObject = transform.target,
                absolutePoint = fabric.util.transformPoint({
                    x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
                    y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
                }, fabricObject.calcTransformMatrix()),
                actionPerformed = fn(eventData, transform, x, y),
                newDim = fabricObject._setPositionDimensions({}),
                polygonBaseSize = fabricObject._getNonTransformedDimensions(),
                newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
                    newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
            fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
            return actionPerformed;
          }
        }
        if (current && (current.get("type") === SYMBOL.POLYLINE.toLowerCase()|| current.get("type") === SYMBOL.POLYGON.toLowerCase())) {
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