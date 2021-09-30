import { useCallback, useEffect } from "react";
import { SYMBOL } from "../util";

export const useDelete = (canvas) => {
    const onDelete = useCallback((ev)=>{
        const { keyCode, key } = ev;
        if (keyCode === 8 && key === "Backspace") {
            let selected = canvas.getActiveObjects();
            if(selected[0] && selected[0].get("type") === SYMBOL.ITEXT && selected[0].get("isEditing")) {
                return void 0; // 如果是text则不删除obj
            }
            canvas.remove(...selected);
        }
    }, [canvas])
    useEffect(() => {
        fabric.util.addListener(window, "keydown", onDelete);
        return () => {
            fabric.util.removeListener(window, "keydown", onDelete)
        }
    }, [canvas]);
};
