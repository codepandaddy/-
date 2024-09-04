/**
 * webpack入口起点文件
 * 
 * 1.运行指令:
      开发环境: webpack ./src/index.js -o ./build/built.js --mode=development
      webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js
      整体打包环境，是开发环境
      生产环境: webpack ./src/index.js -o ./build/built.js --mode=production

      开发环境配置：能让代码运行
        运行项目指令：
          webpack 会将打包结果输出出去
          npx webpack-dev-server 只会在内存中编译打包，没有输出

  2。结论:
    1。webpack能处理js/json资源，不能处理css/img等其他资源
    2。生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化~
    3。生产环境比开发环境多一个压缩is代码。
 */

import data from './data.json';
import '../css/index.less';

import '../css/iconfont.css';

console.log(add(1, 2));

function add(x, y) {
  return x + y;
}

console.log(data);
