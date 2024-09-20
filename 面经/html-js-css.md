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