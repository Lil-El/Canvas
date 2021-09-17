# React

>React经验少，在这里多尝试

## useEffect

- 无法监听Ref、普通对象的变化；

## useCallback

- 如果callback用在listener上，当state变化时，listener仍然是原来的，如果cb内部使用了state，可以替换为Ref或者普通对象

## useRef

- state变化会使页面重新渲染
- ref变化不会使页面重新渲染；相当于全局变量