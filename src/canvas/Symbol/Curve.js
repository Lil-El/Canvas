import { makeOperateCircle, makePath } from "."

let onMoving = (e)=>{
    var p = e.transform.target;
    if (p.name == "p1" || p.name == "p2") {
        if (p.name == "p1") {
          p.curve.path[0][1] = p.left;
          p.curve.path[0][2] = p.top;
        }
        else if (p.name == "p2") {
          p.curve.path[1][3] = p.left;
          p.curve.path[1][4] = p.top;
        }
    } else if (p.name == "o1") {
        p.curve.path[1][1] = p.left;
        p.curve.path[1][2] = p.top;
    }
}

export const makeCurve = (path, canvas)=>{
    let curve = makePath(`M ${path[0]} ${path[1]} Q ${path[2]}, ${path[3]}, ${path[4]}, ${path[5]}`, {
        objectCaching: false,
        hasControls: false,
        selectable: false,
    })
    curve.p1 = makeOperateCircle({
        name: "p1",
        left: path[0],
        top: path[1],
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        radius: 6,
        curve
    })
    curve.p2 = makeOperateCircle({
        name: "p2",
        left: path[4],
        top: path[5],
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        radius: 6,
        curve
    })
    curve.o1 = makeOperateCircle({
        name: "o1",
        left: path[2],
        top: path[3],
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        radius: 10,
        curve
    })
    canvas.add(curve.p1, curve.p2, curve.o1)
    
    curve.p1.on("moving", onMoving)
    curve.p2.on("moving", onMoving)
    curve.o1.on("moving", onMoving)

    return curve;
}