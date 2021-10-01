import { useEffect, useState } from "react"

// Tips: useCurrent在多个hook及页面中调用，会触发多次事件
export default (canvas)=>{
    const [current, setCurrent] = useState(null); // 当前选中的，可能是object，也可能是group
    const [selected, setSelected] = useState([]); // 当前选中的所有object

    useEffect(()=>{
        if(canvas) {
            // canvas.on("mouse:down", ({target})=>{
            //     setCurrent(target)
            // })
            canvas.on("selection:created", ({selected, target})=>{
                setCurrent(target);
                setSelected(selected);
            })
            canvas.on("selection:updated", ({selected, target})=>{
                setCurrent(target);
                setSelected(selected);
            })
            canvas.on("selection:cleared", ()=>{
                setCurrent(null);
                setSelected([]);
            })
        }
    }, [canvas])

    return [current, selected]
}