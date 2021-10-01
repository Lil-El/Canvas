export const makePath = (path, options)=>{
    return new fabric.Path(path, {
        id: new Date(),
        fill: "#ffffff",
        stroke: "black",
        ...options
    })
}