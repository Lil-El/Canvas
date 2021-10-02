import { makeOperateCircle, makePath } from "."

export const makeCurve = (path, options)=>{
    let curve = makePath(`M ${path[0]} ${path[1]} L ${path[2]} ${path[3]}`, {
        objectCaching: false,
        hasControls: false,
        ...options
    })
    curve.on("selected", (ev)=>{
        curve.p1 = makeOperateCircle({
            left: path[0] + curve.left,
            top: path[1] + curve.top,
            originX: "center",
            originY: "center",
            radius: 6
        })
        curve.p2 = makeOperateCircle({
            left: path[2] + curve.left,
            top: path[3] + curve.top,
            originX: "center",
            originY: "center",
            radius: 6
        })
        curve.o1 = makeOperateCircle({
            left: ((path[0] + path[2]) / 2) + curve.left,
            top: ((path[1] + path[3]) / 2) + curve.top,
            originX: "center",
            originY: "center",
            radius: 10
        })
        curve.canvas.add(curve.p1, curve.p2, curve.o1)
    })
    // TODO: 处理曲线修改
    curve.on("moving", (ev)=>{
        let {path, left: offsetX, top: offsetY} = ev.transform.target;
        curve.p1.set({left: path[0][1] + offsetX, top: path[0][2] + offsetY})
        curve.p2.set({left: path[1][1] + offsetX, top: path[1][2] + offsetY})
        curve.o1.set({
            left: (path[0][1] + offsetX + path[1][1] + offsetX) / 2,
            top: (path[0][2] + offsetY + path[1][2] + offsetY) / 2,
        })
    })
    curve.on("deselected", (ev)=>{
        curve.canvas.remove(curve.p1, curve.p2, curve.o1)
    })
    return curve;
}