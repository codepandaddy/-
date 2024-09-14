

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