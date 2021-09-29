import { useEffect, useState } from "react"

export const useSize = (canvas) => {
    const [size, setSize] = useState([0, 0])

    useEffect(()=>{
        canvas?.on("after:render", (ev)=>{
            const group = canvas.getActiveObject();
            if(group) {
                setSize([group.width * group.scaleX, group.height * group.scaleY])
            } else {
                setSize([0, 0])
            }
        })
    }, [canvas])
    return [size]
}