import { useCallback, useEffect, useMemo } from "react";
import useCurrent from "../useCurrent";
import { SYMBOL } from "../util";

export const useKeydown = (canvas) => {
    const [current] = useCurrent(canvas);

    const onKeydown = useCallback((ev)=>{
        
        const { keyCode, key } = ev;

        if (keyCode === 8 && key === "Backspace") {
            // 删除
            let selected = canvas.getActiveObjects();
            console.log(selected);
            if(selected[0]?.get("type") === "group") {
                canvas.remove(...selected[0].getObjects());
                selected[0].destroy();
                canvas.remove(selected[0]);
            } else if (selected[0].get("isEditing")) {
                return void 0;
            } else {
                canvas.remove(...selected);
            }
            canvas.setActiveObject(null)
        } else if(ev.ctrlKey && (ev.code === "KeyA")) {
            ev.preventDefault();
            // 全选
            const all = canvas.getObjects().reduceRight((prev, obj)=>{
                if(obj.get("type") === "group") {
                    obj.destroy();
                    canvas.remove(obj);
                    return prev;
                } else {
                    return [obj, ...prev]; // 保证object的层级正确
                }
            }, []);
            let group = new fabric.Group(all);
            canvas.add(group);
            canvas.setActiveObject(group);
        } else if(ev.ctrlKey && (ev.code === "KeyV")) {
            let curActive = canvas.getActiveObject();
            // 如果对正在编辑的text，进行ctrl + v；直接退出，不禁止默认事件
            if(curActive.get("type") === SYMBOL.ITEXT && curActive.get("isEditing")) return void 0;
            ev.preventDefault();
            if(curActive.get("id")) { // 只能复制单个object
                curActive.clone((cloned)=> {
                    cloned.left += 10;
                    cloned.top += 10;
                    canvas.add(cloned);
                });
            }
        }
        return false;
    }, [canvas])

    // 监听键盘事件
    useEffect(() => {
        fabric.util.addListener(window, "keydown", onKeydown);
        return () => {
            fabric.util.removeListener(window, "keydown", onKeydown)
        }
    }, [canvas]);

    // 全选事件之后需要remove掉group
    useEffect(() => {
        if(!current && canvas) {
            canvas.getObjects().reduceRight((prev, obj)=>{
                if(obj.get("type") === "group") {
                    obj.ungroupOnCanvas();
                    canvas.remove(obj);
                }
            }, []);
        }
    }, [canvas, current]);
    
};
