export function makeText(work, options) {
    let text = new fabric.Textbox(work, {
        id: new Date(),
        stroke: "red",
        fill: "blue",
        width: 100,
        top: 0,
        left: 0,
        fontSize: 18,
        lineHeight: 1,
        fontWeight: "bold",
        textAlign: "left", // 文字对齐："left", "center", "right", "justify", "justify-left", "justify-center" or "justify-right".
        lockRotation: true, // 禁止旋转
        lockScalingY: true, // 禁止Y轴伸缩
        lockScalingFlip: true, // 禁止反转
        splitByGrapheme: true, // 拆分中文，可以实现自动换行
        objectCaching: false,
        ...options
    });
    
    // 解决：当text再次选中时会伸缩的问题（添加了scaleX属性造成了影响）
    text.on("scaling", (ev)=>{
        let target = ev.transform.target
        let width = target.get("width") * target.get("scaleX")
        target.set("width", width)
        target.set("scaleX", 1)
    })
    return text;
}