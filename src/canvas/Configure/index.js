import { useEffect, useState } from "react"
import useCurrent from "../useCurrent"
import { SYMBOL } from "../util"

/**
 * 根据当前symbol的类型，对配置区域进行渲染
 */
export const renderConfigure = (symbol = SYMBOL.NONE)=>{
    if(!symbol) return <></>
    else {
        const configuration = import("../Symbol/" + symbol);
        console.log(configuration);
    } 

}

export const useConfigure = (canvas)=>{
    const [current] = useCurrent(canvas);
    const [renderJSX, setRender] = useState(<></>)

    useEffect(()=>{
        setRender(renderConfigure(current.get("symbol")))
    }, [current])

    return [renderJSX]
}