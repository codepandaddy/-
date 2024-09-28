# websocket

- 是与服务器的全双工、双向通信，不使用http，二是自定义协议，目的是更快地发送小数据块，长连接，有状态的连接，第一次握手即可建立持久性链接
- 心跳机制，保持不被断开
  - 客户端建立
  - 向服务器发送心跳数据包，在一定时间间隔内，websocket发送的空数据包
  - 服务器接收并返回接收的响应
  - 服务器没收到就发送关闭请求
  - 服务器定时向客户端发送心跳数据包，客户端接收并返回响应
  - 客户端没收到就重新连接websocket

# cookie、web storage、indexedDB

- cookie用于服务端和客户端传输，是存储在浏览器中的小型文本文件，主要用于维持状态，通过携带用户信息识别客户端，容量小
  - 创建和发送cookie
  - 存储在浏览器
  - 发送到服务器
  - 服务器检查和利用cookie
  - 更新和删除过期的cookie
- web storage包括sessionstorage和localStorage，是h5的存储技术，有更大存储量，前者只在会话期间有效，后者直在持续化存储
- indexedDB是高级web api，更强大的本地数据库存储能力，使用索引存储检索结构化数据（是对象，而不是数据表），处理离线和复杂数据
  - 离线应用程序
  - 大量
  - 高性能查询

# 响应式设计

## 流式布局‌

- 使用百分比或em单位定义元素宽度和高度，使网站能够自适应不同的屏幕尺寸

- > rem是指相对于根元素的字体大小的单位。

```html
<div class="container">
  <div class="column">Column 1</div>
  <div class="column">Column 2</div>
  <div class="column">Column 3</div>
</div>
<style>
.container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.column {
  flex: 1; /* 自动分配空间 */
  padding: 1rem;
}
</style>
```

## ‌媒体查询‌

- 通过CSS媒体查询检测用户设备类型和屏幕尺寸，并应用不同的样式规则

```css
/* 默认样式 */
.column {
  flex-basis: calc(100% / 3); /* 平分三列 */
}

/* 在小于600px的屏幕上 */
@media (max-width: 600px) {
  .column {
    flex-basis: 100%; /* 单列布局 */
  }
}

@media screen and (max-width:1920px){...}
 
#div0{
    width: 150px;
    height: 200px;
}
// 视口的宽度改变
@media screen and (min-device-width:100px) and (max-device-width:300px){
    #div0{
        background-color: red;
    }
}
 
@media screen and (min-device-width:301px) and (max-device-width:500px){
    #div0{
        background-color: blue;
    }
}
```

## 弹性图片和视频

- 使用CSS `max-width`属性使图片和视频能够自适应不同的屏幕尺寸

```html
<img src="example.jpg" alt="Example image" class="responsive-image">
```

```css
.responsive-image {
  max-width: 100%;
  height: auto;
}
```

## 栅格系统‌

- 栅格是以规则的网格阵列来指导和规范网页中的版面布局以及信息分布，提高界面内布局的一致性，节约成本。

## 弹性布局

- 可以配合rem处理尺寸的适配问题

- > flex-direction：子元素在父元素盒子中的排列方式
  >
  > flex-wrap：子元素在父元素盒子中的是否换行
  >
  > flex-flow：flex-direction和flex-wrap属性的简写形式。语法：flex:<flex-direction>||<flex-wrap>
  >
  > justify-content，用来在存在剩余空间时，设置为间距的方式
  >
  > align-items，设置每个flex元素在交叉轴上的默认对齐方式（单行看待）
  >
  > align-content，设置每个flex元素在交叉轴上的默认对齐方式（整体看待）

| 属性值         | 作用                                  |
| :---------- | ----------------------------------- |
| flex-basis  | 设置弹性盒伸缩基准值（设置后，宽度将不再生效）             |
| flex-grow   | 设置弹性盒子的扩展比率                         |
| flex-shrink | 设置弹性盒子的缩小比率                         |
| flex        | flex-grow，flex-shrink，flex-basis的缩写 |

| 属性                   | 作用                            |
| -------------------- | ----------------------------- |
| flex: auto           | flex: 1 1 auto                |
| flex: none           | flex: 0 0 auto                |
| flex: 0%  flex:100px | flex: 1 1 0%  flex: 1 1 100px |
| flex:1               | flex: 1 1 0%                  |

# es5和es6的区别

- 箭头函数
- 块级作用域
- 模板字符串
- 解构赋值
- 类与继承
- 默认参数值
- promise
- 模块化导入导出
- es7的includes和幂运算

# 盒模型

- width、height、padding、border、margin
- W3C盒子模型（标准）
  - width和height
  - box-sizing:content-box
- ie盒子（怪异盒）
  - width、height、padding、border
  - box-sizing:border-box

# 变量提升

- 可以用use strict 禁止
- var声明的变量，提到当前作用域前面
- 不会提升赋值，只是声明，得到的值是undefined


# 箭头函数和普通函数

- 箭头函数可以用于
  - 变量解构，请求结构，只接收返回数据中需要的字段
  - 简化回调函数
- 箭头函数不适用于
  - 需要用到this指向
- 区别
  - 前者没有原型prototype
  - 前者不会创建自己的this，不会指向当前对象而是全局对象
  - 不能修改箭头函数的this指向
  - 前者无法作为构造函数使用
  - 前者没有自己的arguments，super、new.target也没有
  - 箭头函数不支持重命名函数参数，普通函数的函数参数支持重命名
  - 语法更简洁清晰

# 防抖节流

## 防抖debounce

- 应用场景

  - 点击按钮事件，用户在一定时间段内的点击事件，为了防止和服务端的多次交互，我们可以采用防抖。
  - 输入框的自动保存事件
  - 浏览器的`resize`事件

- 概念：触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间

- ```js
  function debounce(fun,wait){
      let timer;
      return (...args)=>{
      	if (timer){
          	clearTimeout(timer);
          }
          timer = setTimeout(()=>{
          	fun(...args);
          },wait)
      }
  }
  window.onresize = debounce(()=>{
  	console.log(1);
  },1000);
  //页面在频繁resize的时候，控制台也只会打印一次1

  ```

## 节流throttle

- 减少流量，高频事件触发，但在n秒内只会执行一次。即，控制事件触发的频率

- `scroll`事件，滚动的过程中每隔一段时间触发事件

- ```js
  //利用时间间隔实现
  function throttle1(fun,wait){
  	let time1 = 0;
  	return (...args)=>{
     		const time2 = Date.now()
          const timeInterval = time2 - time1;
   		if ( timeInterval < wait){
   			return 
   		}else {
  			time1 = time2;
              fun(...args);
  		}
      }
  }
  window.onresize = throttle1(()=>{
  	console.log(1);
  },1000);
  //页面在频繁resize的时候，控制台会每隔1秒打印一次

  //利用定时器实现
  function throttle2(fun,wait){
  	let timer;
  	return (...args)=>{
  		if (timer){
  			return
  		}else {
  			timer = setTimeout(()=>{
  				timer = null;
  				fun(...args);
  			},wait);
  		}
  	}
  }
  window.onresize = throttle2(()=>{
  	console.log(1);
  },1000);
  //页面在频繁resize的时候，控制台会每隔1秒打印一次

  ```

# 如何实现图片懒加载

- 判断可见区域，监听window.scroll事件，通过clientTop、offsetTop、clientHeight、scrollTop各种关于图片的高度作对比

- 控制图片加载，监听window.scroll事件中，当满足条件时动态设置img标签的src就行

- 优化

  - **判断可见区域**，Element.getBoundingClientRect()能快速返回元素的大小及其相对于视口的位置

  - ```js
    console.log(document.body.getBoundingClientRect()); 
    //DOMRect {
    //  bottom: 0
    //  height: 0
    //  left: 0
    //  right: 1920
    //  top: 0
    //  width: 1920
    //  x: 0
    //  y: 0
    //}

    ```

  - 优化window.scroll监听，添加节流器，使用lodash库的lodash.throttle

  - 综合上面两个优化，出现了第三个事件IntersectionObserver API，一个能够监听元素是否到了当前视口的事件

  - ```js
    const observer = new IntersectionObserver((changes)=>{
      // changes: 目标元素集合
      changes.forEach((change) => {
        // 可见
        if (change.isIntersecting) {
          const img = change.target
          img.src = img.dataset.src
          observer.unobserve(img)
        }
      })
    })
    observer.observe(img)

    ```

  - 最终优化是添加loading属性，<img src="XXX.jpg" loading="lazy">但仅兼容chrome

# 实现拖拽功能

- 实现一个基本的拖拽功能通常涉及监听元素的mousedown、mousemove和mouseup事件

- ‌**鼠标按下时**‌：识别选中的页面元素，记录元素的起始点（横纵坐标）。

- ‌**鼠标移动时**‌：将被移动元素进行绝对定位到目前鼠标移至的相对位置上。

- ‌**鼠标弹起时**‌：通过位置计算出目标元素的位置，将起始位置元素与目标位置元素互换。

- 优化：**requestAnimationFrame**

  - 定时循环操作的接口，类似setTimeout，用于按帧对网页进行重绘，让个网页动画效果有一个统一的刷新机制

  - ```js
    const test = document.querySelector<HTMLDivElement>("#test")!;
    let i = 0;
    let requestId: number;
    function animation() {
      test.style.marginLeft = `${i}px`;
      requestId = requestAnimationFrame(animation);
      i++;
      if (i > 200) {
        cancelAnimationFrame(requestId);
      }
    }
    animation();
    ```

  - setTimeout会比它更快，原因是浏览器的渲染机制，会在必要时渲染，页面改变菜渲染，需要考虑到硬件的刷新频率限制、页面性能等。setTimeout就是一直在回调，回调完几次后才渲染，requestAnimationFrame只会在每次渲染之前调用，所以看上去setTimeout更快


# promise解决地狱回调

- 通过链式调用.then()来避免，将所有方法变成异步方法，return promise，实现扁平化

- ```js
  function doSomething() {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve('Result from doSomething');
          }, 1000);
      });
  }

  function doSomethingElse(result) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve(result + ' -> Result from doSomethingElse');
          }, 1000);
      });
  }

  function doAnotherThing(result) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve(result + ' -> Result from doAnotherThing');
          }, 1000);
      });
  }

  function doFinalThing(result) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve(result + ' -> Result from doFinalThing');
          }, 1000);
      });
  }
  // 扁平化
  doSomething()
      .then(result1 => {
          console.log(result1);
          return doSomethingElse(result1);
      })
      .then(result2 => {
          console.log(result2);
          return doAnotherThing(result2);
      })
      .then(result3 => {
          console.log(result3);
          return doFinalThing(result3);
      })
      .then(result4 => {
          console.log(result4);
      })
      .catch(error => {
          console.error(error);
      });

  ```

# css兼容性

## 不同浏览器的标签默认的内外边距不同

- 不加样式控制，各自的margin和padding差异较大
- 最常见最易解决的问题*{margin:0;padding:0;}

## 块属性标签float后，margin不同使之换行

- 比较常见，可在float标签样式控制中，添加display:inline，将其转化为行内属性
- 最常见的div+css布局，float横向布局，用margin实现间距就会有问题、

## 设置较小高度标签（<10px），却超出高度

- ie6、7和遨游浏览器中常见，超出自己设置的高度
- 给超出高度的标签设置overflow:hidden;
- 或者设置行高line-height小于你设置的高度
- 这种会出现在小圆角背景的标签里，出现这个问题是ie8之前的浏览器都会给标签一个最小默认的行高的高度，及时是空的高度也是默认高度

## 透明度兼容的css

```css
.transparent_class {  
      filter:alpha(opacity=50);  
      -moz-opacity:0.5;  
      -khtml-opacity: 0.5;  
      opacity: 0.5;  
}
```

## 鼠标指针

- cursor:hand只在ie识别
- 建议只用cursor：pointer

# 实现 dom 循环完之后回调

- 在JavaScript中，实现DOM循环之后的回调，通常可以使用`Promise`结合`async/await`或者传统的回调函数。以下是使用`Promise`和`async/await`的示例代码：

- ```js
  // 使用Promise和async/await
  function loopDomElements(selector, callback) {
    return new Promise((resolve) => {
      const elements = document.querySelectorAll(selector);
      let i = 0;
      const next = () => {
        if (i < elements.length) {
          callback(elements[i], i);
          i++;
          setTimeout(next, 0); // 模拟异步操作
        } else {
          resolve(); // 所有循环都完成后，调用resolve
        }
      };
      next(); // 开始循环
    });
  }
   
  // 使用函数
  async function processDomElements() {
    await loopDomElements('.some-class', (element, index) => {
      // 对每个元素执行的操作
      console.log(`Processing element ${index}:`, element);
    });
    console.log('All DOM elements have been processed.');
  }
   
  processDomElements(); // 调用函数开始处理DOM元素
  ```

- ​

# css3新特性

- **媒体查询**‌：允许开发者根据不同设备的屏幕尺寸、分辨率和方向等条件，应用不同的样式规则，这对于响应式设计尤为重要。
- ‌**弹性盒子布局（Flexbox）**‌：提供了一种更加高效的方式来布局、对齐和分配容器中项目的空间，即使它们的大小未知或是动态变化的。
- ‌**网格布局（Grid Layout）**‌：允许以网格的形式对页面进行布局，可以创建复杂的页面布局，同时保持内容的灵活性和响应性。
- ‌**动画和过渡**‌：CSS3引入了动画和过渡效果，使得元素的变换更加流畅和自然。
- ‌**变形（Transforms）**‌：允许元素进行旋转、缩放、倾斜和移动等变换。
- ‌**盒阴影（Box Shadow）和文本阴影（Text Shadow）**‌：为元素添加阴影效果，增强视觉效果。
- ‌**渐变（Gradients）**‌：包括线性渐变和径向渐变，用于创建平滑的颜色过渡效果。
- ‌**自定义字体（Web Fonts）**‌：允许网页使用未安装在用户设备上的字体。
- ‌**多重背景（Multiple Backgrounds）**‌：允许一个元素设置多个背景图像。
- ‌**圆角（Border Radius）**‌：为元素的边框添加圆角效果，增强设计的友好性和美观性。

# h5新特性

- **语义化标签**：HTML5新增语义化的标签主要有：<header>、<footer>、<section>、<nav>、<aside>、<article>、<main>等，这些标签在开发过程中能够更清晰的描述网页的结构和内容。
- **增强型表单**： HTML5引入了一些新的表单元素和属性，如<input>元素的新类型（如email、url、tel、search、number等）、<datalist>元素、<output>元素等，以及新的表单属性（如required、autocomplete、pattern等），使得表单的功能和用户体验得到了提升。
- **音频和视频**：HTML5引入了<audio>和<video>标签，在开发过程中可以网页上直接嵌入音频和视频内容，而不需要引入外部插件或者播放器
- **Canvas绘图**：HTML5提供了<canvas>元素，可以在网页上绘制图形，为开发者提供了更多的创作空间
- **SVG绘图**： HTML5提供了SVG（可缩放矢量图形）绘图，使得开发者可以在网页上创建更加复杂的矢量图形
- **地理定位**：HTML5引入了地理定位API，允许网页请求用户的地理位置信息
- **拖放API**：HTML5提供了拖放API，使得开发者可以轻松地实现网页元素的拖放功能
- **webWorker**：webWorker允许在后台线程中运行脚本，不会阻塞用户界面，可以提高网页的性能和响应速度。
- **WebStorage**：HTML5提供了Web Storage API，包括sessionStorage（会话存储）和locaStorage（永久存储），用于在客户端（浏览器）中存储数据，而不需要与服务器进行通信。提供了比传统的cookie更大的存储空间和更高的安全性。
- **websocket**：HTML5引入了WebSocket API，提供了一种在用户的浏览器和服务器直接建立持久连接方式，使得实时通信变得更加容易

# less和sass的区别

- 编译环境不同：sass需要ruby，是在服务器端处理；less需要less.js输出css到浏览器，或者开发环节使用后编译成css
- 变量符号不同：less是@，sass是$
- 变量作用域不同
  - less内部重新定义变量，不会变量提升
  - sass重新定义变量，会变量提升
- 条件语句：sass支持，less不支持
- 引用外部css文件：scss外部文件命名必须以_开头，less跟css一样
- 工具库不同：sass是工具库compass有模块和模板，less有ui组件库bootstrap

# 深入解析CSS样式优先级

- 作为前端多多少少都会对CSS样式的权重有一定的了解。最常用的方法就是对不同的选择器分配不同的权重比，常见的就是

  | 选择器          | 权重值   |
  | ------------ | ----- |
  | !important标识 | 10000 |
  | 行内样式         | 1000  |
  | id选择器        | 100   |
  | 类选择器         | 10    |
  | 标签选择器        | 1     |
  | 通配符 *        | 0     |

- **权重累加**：相同类型的权重值累加，然后在比较相同类型选择器的值

- ```css
  div {
    width: 100px;
    height: 100px;
  }
  #box10 {
    background: green;
  }
  .box .box1 .box2 .box3 .box4 .box5 .box6 .box7 .box8 .box9 .box10 {
    background: red;
  }
  ```

- 按理说 `#box10` 的权重为 100 * 1 = 100。`.box .box1 .box2 .box3 .box4 .box5 .box6 .box7 .box8 .box9 .box10` 的权重为 10 * 11 = 110

- 但结果还是 green

- 2012年实验证明，**256个class选择器可以干掉1个id选择器**，ie可以呈现，但现在大部分浏览器不能呈现这一点，而现在是可以实现**1000个class干掉一个ID**

- w3c中样式选择器的权重优先级的排序如下

>  important > 内嵌样式 > ID > 类 | 伪类 | 属性选择  > 标签 | 伪元素 > 伪对象 > 继承 > 通配符 | 子选择器 | 相邻选择器 

- 伪类选择器，如`:hover`
- 属性选择器，如`[type="text"]`
- 伪元素选择器，如`::first-letter`
- 子选择器`>`，相邻兄弟选择器`+`等等

# 屏幕尺寸标准

- 超小屏幕（手机）：col-xs（<768像素）
- 小屏幕（平板）：col-sm（>=768）
- 中等屏幕（电脑）：col-md（>=992）
- 大屏幕（大屏电脑）：col-lg（>1200px）

# form表单的enctype属性

- enctype是encodetype，规范了form表单在发送到服务器时的编码方式
- application/x-www-form-urlencoded：默认的，只能上传文本格式的文件，不能用于发送文件，在发送前会编码所有字符，即在发送到服务器前，所有的字符都会进行编码（空格转换为+，+转换为空格，特殊符号转换为ASCII HEX值）
- multipart/form-data：指定传输数据为二进制类型，比如图片、mp3、文件，是将文件以2进制 的形式上传，可以实现多种类型的文件上传
- text/plain：纯文本的传输，空格转换为+，但不对特殊字符编码，一般用email之类的，不能用于发送文件
- 如果出现乱码问题，比如+转换为空格或其他乱码现象，可以用
  - URLEncoder.encode(value,'utf-8')加密
  - URLEncoder.decode(value,'utf-8')解密

# null和undefined的区别

- `null`是一个表示"无"的对象, `Number(null) === 0 `，undefined是一个表示"无"的原始值，`Number(undefined) === NaN`
- `null`表示一个值被定义了, 但是这个值是空值
  - 作为函数的参数, 表示函数的参数不是对象
  - 作为对象原型链的终点`Object.getPrototypeOf(Object.prototype)`
- `undefined`表示不存在该值的定义
  - 变量被声明了还没有赋值, 表现为`undefined`
  - 调用函数时应该提供的参数没有提供, 参数值表现为`undefined`
  - 对象没有赋值的属性, 该属性的值表现为`undefined`
  - 函数没有返回值, 默认返回`undefined`
- null == undefined但null !== undefinded

# 行内元素和块级元素如何区别

- 行内：只占据它对应标签的边框所包含的空间
- 块级：占据其父元素（容器）整个空间，因此创建了一个块
- 区别：
  - 行内元素不会新起一行，块级元素会新起一行
  - 块级元素可以设置 width, height属性，注意：块级元素即使设置了宽度，仍然是独占一行的。而行内元素设置width, height无效。
  - 块级元素可以设置margin 和 padding。行内元素的水平方向有效，竖直方向无效
  - 块级元素可以包含行内元素和块级元素。行内元素不能包含块级元素
  - 设置居中
    - 行内：`text-align:center`是当外层是div时，设置div；垂直居中`height:30px;line-height:30px  `
    - 块级：`margin:0 auto; width:500px;  `要设置父容器宽度；垂直居中`margin:0 auto;height:30px;line-height:30px`

## 什么是物理像素，逻辑像素和像素密度，为什么在移动端开发时需要用到@3x, @2x 这种图片？

- 以 `iPhone XS` 为例，当写 CSS 代码时，针对于单位 `px`，其宽度为 414px & 896px，也就是说当赋予一个 div 元素宽度为 414px，这个 div 就会填满手机的宽度；

- 而如果有一把尺子来实际测量这部手机的`物理像素`，实际为 1242*2688 物理像素；经过计算可知，1242/414=3，也就是说，在单边上，一个`逻辑像素` = 3 个物理像素，就说这个屏幕的像素密度为 3，也就是常说的 3 倍屏。

- 对于图片来说，为了保证其不`失真`，1 个图片像素至少要对应一个物理像素，假如原始图片是 `500*300` 像素，那么在 3 倍屏上就要放一个 `1500*900` 像素的图片才能保证 1 个物理像素至少对应一个图片像素，才能不失真。

- 当然，也可以针对所有屏幕，都只提供最高清图片。虽然`低密度`屏幕用不到那么多图片像素，而且会因为下载多余的像素造成`带宽浪费`和`下载延迟`，但从结果上说能保证图片在所有屏幕上都不会失真。

- 还可以使用 CSS 媒体查询来判断不同的像素密度，从而选择不同的图片:

- ```css
  my-image { background: (low.png); }
  @media only screen and (min-device-pixel-ratio: 1.5) {
    #my-image { background: (high.png); }
  }
  ```


# js原始值类型（基本数据类型）

- string、number、boolean、undefined、symbol、null

- ```js
  console.log(typeof null) // object
  console.log(typeof undefined) // undefined
  console.log(typeof true) // boolean
  console.log(typeof 1) // number
  console.log(typeof '123') // string
  console.log(typeof 1111n) // bigint
  console.log(typeof Symbol()) // symbol
  ```

- null 返回的类型是 object，这是历史原因造成的。以后估计也不会改了。要测试null，不能使用typeof，需要用`===null`来测试。

- Symbol没有字面量写法，也不能用new创建。

- bigint后缀是n