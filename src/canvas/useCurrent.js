import { useEffect, useState } from "react"

export default (canvas)=>{
    const [current, setCurrent] = useState(null)

    useEffect(()=>{
        canvas && canvas.on("mouse:down", ({target})=>{
            setCurrent(target)
        })
    }, [canvas])

    return [current]
}