# Fabric.js

## 基础类
---------
### Canvas

- requestRenderAll | renderAll
- add(obj, obj, ...)
- remove(obj, obj, ...)
- setActiveObject(): 设置当前活跃的object
- getActiveObjects: 获取选中的所有object
- getActiveObject: 获取当前选中的object，如果选中了多个，返回的是一个object包含了多个object
- isEmpty(): 判断canvas是否为空

### Object

> 所有的2D图形对象都继承自Object（Root）

- coord：指的是物体外边可以控制旋转、大小的线框 [When to cass setCoords](https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords)

- setCoords(): 更新coord
- selection: Boolean
- setControlVisible(): 控制controls的显隐（tl:左上角，mr:右中。。。。）

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
- destroy(): 从canvas remove时，同时需要destroy group；才可是objects状态恢复

### util

- addListener | removeListener
- sin | cos
- degreesToRadians | radiansToDegrees 
- 点以弧度进行旋转
- HTML相关dom操作
- transform matrix：变换矩阵


# 矩阵

> 矩阵的意义：空间转换（二维、三维的平移、旋转、缩放、斜切等）
 
## fabric

fabric中的矩阵大多是6个值，即2*3矩阵（2行3列）。书写顺序是竖直的
```
    [1 0 0 1 x y]
         即
    [ 1  0  x
      0  1  y ]
```
## 空间转换

>左乘，置换矩阵（transform matrix）在左侧

- 计算（平移、旋转等），计算结果：[a\*x + c\*y, b\*x + d\*y]

```
  [         [
    a c       x
    b d   *   y
        ]       ]
```
- 组合：
  例如：先平移后旋转，计算公式如下（a-d：平移矩阵，e-h：旋转矩阵）
```  
  [         [         [
    e  g      a c       x
    f  h  *   b d   *   y
        ]         ]       ]
```

# TODO: 

- 曲线绘制

- React项目搭建