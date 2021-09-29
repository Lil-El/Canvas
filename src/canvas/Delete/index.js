import { useCallback, useEffect } from "react";

export const useDelete = (canvas) => {
    const onDelete = useCallback((ev)=>{
        const { keyCode, key } = ev;
        if (keyCode === 8 && key === "Backspace") {
            let selected = canvas.getActiveObjects();
            canvas.remove(...selected);
        }
    }, [canvas])
    useEffect(() => {
        canvas?.on("selection:updated", (ev)=>{
            console.log(ev);
        })
        fabric.util.addListener(window, "keydown", onDelete);
        return () => {
            fabric.util.removeListener(window, "keydown", onDelete)
        }
    }, [canvas]);
};
