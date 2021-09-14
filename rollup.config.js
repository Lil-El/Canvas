import uglify from "rollup-plugin-uglify"
import liveServer from "rollup-plugin-live-server"
import resolve from '@rollup/plugin-node-resolve'
import babel from "@rollup/plugin-babel"
import replace from "@rollup/plugin-replace"
import postcss from 'rollup-plugin-postcss' // rollup-plugin-postcss-module 支持css module
import commonjs from "@rollup/plugin-commonjs"
import liveReload from "rollup-plugin-livereload"
import json from "@rollup/plugin-json"
// import autoprefixer from 'autoprefixer';

const mode = process.env.NODE_ENV;
const isWatch = process.env.ROLLUP_WATCH;
const isProd = mode === "production";

// split chunk：
// const options = [ {...}, {...}, {...} ] // require('./rollup.config.js')
// options.map(async option => {
//     const bundle = await rollup.rollup(option.input);
//     await bundle.write(option.output);  // 直接导出
// })

export default {
    // experimentalCodeSplitting: true, 代码分割，需要配置output.dir不是.file
    // preserveModules: true, 保持目录
    input: "src/main.js",
    output: { // 配置成数组可以输出多个
        file: "dist/index.js",
        format: "iife", // iife esm cjs=commonjs umd=(amd cjs iife) amd
        sourcemap: true,
        exports: 'named',
        // globals：和external搭配
        // globals: { // global.React; 需要手动在html引入React的js文件
        //     'react': 'React',
        //     'react-dom': 'ReactDom'
        // }
    },
    // external: ["react", "react-dom"], // 不被打包
    watch: {
        include: "src/**"
    },
    // rules    https://www.cnblogs.com/blackcat/p/12027440.html
    plugins: [
        replace({ 'process.env.NODE_ENV': JSON.stringify('development') }), // 或者production
        babel({ // 先babel、后common
            // exclude: "**/node_modules/**"
        }),
        resolve(),
        json(),
        commonjs(),
        postcss({
            modules: true // css module；
        }),
        isWatch && liveServer({
            port: "8080",
            root: ".",
            file: "/public/index.html",
            open: false,
            wait: 500
        }),
        isProd && uglify({
            compress: {
                pure_getters: true,
                unsafe      : true,
                unsafe_comps: true,
                warnings    : false
            }
        }),
        liveReload({
            watch: 'dist'
        })
    ]
}
