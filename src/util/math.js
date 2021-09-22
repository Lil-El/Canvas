/**
 * @param {Array[Object | Array]} coords collections of coords
 * @returns {Array} coords
 */
export function flatCoords(...coords) {
    return coords.reduce((prev, coord) => {
        if (Object.prototype.toString.call(coord) === "[object Array]") {
            return [...prev, ...Object.values(coord)];
        } else if (coord instanceof Object) {
            return [...prev, coord.x, coord.y];
        } else {
            console.warn("coord must be object of array");
        }
    }, []);
}

/**
 * @param {{x: number, y: number} | [x: number, y: number]} pointA A点
 * @param {{x: number, y: number} | [x: number, y: number]} pointB B点
 * @description calculate the distance from pointA to pointB
 */
export function distance(pointA, pointB) {
    let [x1, y1, x2, y2] = flatCoords(...arguments);
    return Math.round(Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2));
}

// 计算三角形面积
export function areaOfTriangle(pointA, pointB, pointC) {
    let A = distance(pointA, pointB);
    let B = distance(pointB, pointC);
    let C = distance(pointC, pointA);
    let P = Math.round((lineA + lineB + lineC) / 2);
    return Math.round(Math.sqrt(P * (P - A) * (P - B) * (P - C)))
}

/**
 * @param {{x: number, y: number} | [x: number, y: number]} pointA A点
 * @param {{x: number, y: number} | [x: number, y: number]} pointB B点
 * @param {{x: number, y: number} | [x: number, y: number]} pointC C点
 * @description calculate the distance of vertical from PointA to Line B-C
 */
export function verticalDistance(pointA, pointB, pointC) {
    const area = areaOfTriangle(...arguments);
    let line = distance(pointB, pointC);
    return Math.round((2 * area) / line);
}

// 底部与垂线焦点坐标; x , y, 是否在线内
export function getCoordOfVertical(pointA, pointB, pointC){
    let [x, y, x1, y1, x2, y2] = flatCoords(...arguments);
    // 底线的k、b
    let k = Math.round((y1 - y2) / (x1 + x2));
    let b = Math.round(y1 - k * x1);
    // 垂线的k、b
    let vK = Math.round(-(1 / k));
    let vB = Math.round(y - vK * x);
    // 交点 
    let vX = (vB - b) / (k + - vK);
    let vY = vK * vX + vB;
    return [vX, vY, [x, x1, x2].sort()[1] === x && [y, y1, y2].sort()[1] === y];
}