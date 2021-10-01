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

- M = moveto
- L = 线; L: x, y   l: dx, dy
- H = horizontal 线; H: x   h: dx
- V = vertical 线; V: y   v: dy
- C = curveto
  - 0,0 20, 0 20, 20;这三个点可以绘制一个圆形的1/4的边框。0,0和20,20在边框上
- S = smooth curveto
- Q = quadratic 二次贝瑟尔曲线
- T = smooth quadratic 贝瑟尔曲线
- A = elliptical Arc 椭圆弧线
- Z = 闭合

>以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位。

### Group

导出功能：先将所有的object添加至group中，获取left、width等属性；导出图片之后，先将group destroy将object状态恢复并从canvas中删除group

- add：添加object进group中
- addWithUpdate：添加的同时且更新

### util

- addListener | removeListener

# TODO: 

- popup 尖角位置配置；popup垂直反转尖角位置问题
- 文字换行动态展示；文字宽度修改动态修改文字换行
- useCurrent优化事件
- 