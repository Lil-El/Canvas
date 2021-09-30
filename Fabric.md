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

### Line

- constructor: 构造器
  - [x1, y1, x2, y2]
  - options

### PolyLine & PolyGon

- constructor: 构造器
  - [{x, y}, {x, y}, ...]
  - options

### Path

> C、L表示绝对坐标位置
> c、l表示相对上一个点的偏移量

- M: 起始
- C: 曲线（弧）（贝瑟尔曲线）
- L: 直线
- z: 闭合

### Group

导出功能：先将所有的object添加至group中，获取left、width等属性；导出图片之后，先将group destroy将object状态恢复并从canvas中删除group

- add：添加object进group中
- addWithUpdate：添加的同时且更新

### util

- addListener | removeListener