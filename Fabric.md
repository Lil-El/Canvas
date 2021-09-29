# Fabric.js

## 基础类
---------
### Canvas

- requestRenderAll | renderAll
- add(obj, obj, ...)
- remove(obj, obj, ...)
- getActiveObjects: 获取选中的所有object
- getActiveObject: 获取当前选中的object，如果选中了多个，返回的是一个object包含了多个object

### Object

> 所有的2D图形对象都继承自Object（Root）

- coord：指的是物体外边可以控制旋转、大小的线框 [When to cass setCoords](https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords)

- setCoords: 更新coord

### Point

### util

- addListener | removeListener