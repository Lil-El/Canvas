# Canvas

- This repository leverages rollup to package dependency.

## Rollup Config
---------
- use `yarn` add `canvas` `rollup` `react` package

[rollup 源码博客](https://www.cnblogs.com/xiaoyuxy/p/12574632.html)
[rollup配置react的问题](https://zhuanlan.zhihu.com/p/158923027)
[参考](http://www.geekschool.org/2020/07/09/6309.html)
[rollup react组件库配置](https://www.it610.com/article/1297425445276426240.htm)

#### 打包时：

- 由于工程默认导出文件夹下的index.js文件，打包报错引入`rollup-plugin-commonjs`插件
- React组件的"<"解析报错，引入`@babel/preset-react`解决
- rollup.config.js plugins顺序不正确，`先babel()再commjs()`，不然commjs()打包报第2个错误
- class组件中的属性报错，引入`@babel/plugin-proposal-class-properties`解决
- class组件中的修饰符@打包报错，引入`@babel/plugin-proposal-decorators`解决，`.babelrc 顺序必须在class-properties前`
- 代码中使用的新特性解析报错，引入`@babel/preset-env`解决
- 使用rollup-plugin-less/rollup-plugin-less-modules打包出来引入的CSS文件不对，替换成rollup-plugin-postcss/rollup-plugin-less
- Css Module使用插件 rollup-plugin-postcss-modules

#### 运行时：

- 运行打包文件报错，引入babel @babel/plugin-transform-runtime解决
- uglif插件压缩报错，替换成rollup-plugin-terser解决

#### Code:

```js config
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss-modules";
import ascii from "rollup-plugin-ascii";
import resolve from "@rollup/plugin-node-resolve";
import includePaths from "rollup-plugin-includepaths";
import { terser } from "rollup-plugin-terser";

const externalAry = [
  "antd",
  "antd/es/locale/zh_CN",
  "antd/dist/antd.css",
  "moment",
  "moment/locale/zh-cn",
  "echarts",
  "prop-types",
  "snowflake-id",
  "win-trade-base",
  "@lugia/lugiax",
  "@ant-design/icons",
  "react",
  "react-transition-group",
  "react-dnd",
  "react-dnd-html5-backend",
  "react-loadable",
  "react-resizable",
];

export default {
  input: "yss-biz-base/index.js",
  output: {
    file: "dist/index.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    includePaths({
      include: { "yss-biz": "./yss-biz-base/index.js" },
    }),
    babel({ exclude: "**/node_modules/**", runtimeHelpers: true }),
    commonjs(),
    ascii(),
    postcss({
      extract: true,
      namedExports: true,
      minimize: true,
      sourceMap: true,
      extensions: [".less", ".css"],
    }),
    terser(),
  ],
  //不能使用正则匹配，有定制化组件也是以echarts命名
  external: externalAry,
};
```

```json package.json
"dependencies": {
    "@babel/core": "^7.10.0",
    "@babel/plugin-proposal-class-properties": "^7.8.3",
    "@babel/plugin-proposal-decorators": "^7.10.0",
    "@babel/plugin-syntax-jsx": "^7.8.3",
    "@babel/plugin-transform-react-jsx": "^7.9.4",
    "@babel/plugin-transform-runtime": "7.1.0",
    "@babel/preset-env": "^7.10.0",
    "@babel/preset-react": "^7.10.0",
    "@babel/runtime": "7.1.2",
    "@rollup/plugin-node-resolve": "^8.0.0",
    "rollup": "^2.10.9",
    "rollup-plugin-ascii": "^0.0.3",
    "rollup-plugin-babel": "^4.4.0",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-includepaths": "^0.2.3",
    "rollup-plugin-less": "^1.1.2",
    "rollup-plugin-postcss": "^3.1.1",
    "rollup-plugin-terser": "^6.1.0"
  },
  "devDependencies": {
    "colors": "^1.4.0",
    "inquirer": "^7.1.0"
  }
```

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": [
    "@babel/plugin-syntax-jsx",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-react-jsx",
    "@babel/plugin-transform-runtime"
  ]
}
```

## Babel Config
---------

[参考](https://www.cnblogs.com/bai1218/p/12392180.html)

```json .babelrc
{
    "presets": [
      "@babel/preset-env", 
      "@babel/preset-react"
    ],
    "plugins": ["transform-class-properties"]
}

```

