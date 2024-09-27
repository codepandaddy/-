# v-if和v-for哪个优先级更高

- 首先，实践中不能把他俩放在同一个元素上，因为在循环里都会有个列表渲染函数，如果有if则会出现在渲染函数中，导致每次都要在渲染函数中判断一遍
  - 为了避免这种情况，可以先过滤数组，用计算属性computed处理，或者用template标签（类似将if判断放在渲染函数调用前）
- 其次，vue2中v-for优先级更高，哪怕只渲染某部分列表，也会遍历整个列表
- vue3中v-if优先级更高，如果调用变量不存在则抛出异常

# vue2和vue3的区别

## 双向绑定原理（响应式原理）

- 首先，该原理定义是：能够使数据变化可以被检测并对这种变化做出响应，同时绑定到视图，也即是MVVM框架的核心，数据驱动应用，有利于前后端分离
- 通过响应式加上虚拟dom和patch算法，不需要关注dom操作，减少开发难度


- vue2用的是Object.defineProperty做数据拦截，每个属性都有get、set方法，需要借助api深度监听
  - observer（给属性添加getter依赖收集和 setter派发更新）->dep（收集依赖，每个响应式对象都有dep实例，通知subs里每个watcher）->watcher（实例化dep并向dep.subs中添加watcher）
  - 初始化时递归遍历造成性能损失，增删需要用户使用vue.set和delete等特殊api才能生效，否则对象定义的新属性、数组操作监听不到
  - 同时不支持es6的set和map
- vue3用proxy，也实现数据拦截，优化block，tree，solt，diff，不需要特殊api就能监听，响应式被抽取为reactivity包支持第三方扩展使用
  - 不兼容ie

## 声明周期

- vue3大部分生命周期在vue2的周期前加 on 即可
- 但vue3没有beforeCreate 和 created两个周期，可以在setup中自己定义一个

## 组件传值props和emit

- Vue2中是 props和 this.$emit 
- Vue3中则是[defineEmits defineProps] props emit，或引入mitt

## 选项式api和组合式api

- Vue2中 选项式的api，创建组件时需要使用各种选项 data methods  watch等
- Vue3组合式允许将相关的代码逻辑放在一起处理，让代码更易于理解和维护
  - setup函数为组件设置初始值，如响应式数据、计算属性、方法等
  - ref与reactive
  - computed与watch

## mixins和hooks

- 都可以实现一段代码多页面复用的效果
- Vue 2 中，Mixins 是一种全局特性，可以在多个组件之间共享代码。你可以创建一个 Mixin 对象，然后在组件中通过 Mixins 选项引入这个对象，从而将 Mixin 中的属性和方法合并到组件中
  - 如果多个 Mixins 中有相同的属性或方法，可能会导致命名冲突
  - 隐式引入变量，无法定位变量的位置，不知道在父组件里还是mixins里，多个mixins就更难找了
  - 如果mixins里有很多代码，但父组件只用一段，就会增加无效代码的引用
- Vue3的Hooks允许你将相关的逻辑组合到一起，形成一个逻辑单元
  - `hooks`中引入的变量通过`hooks 名.变量名`的方式进行使用，从而避免了变量重名的问题

## 根标签

- vue2必须有，vue3自带一个根标签叫做Fragment，可以节省空间，提高效率

# vue3响应式原理

- 根本实现原理，就是对基本操作的拦截，读取和设置，读取的时候就把副作用函数存到“桶”里面，设置的时候就拿出来执行
- 接着用weekmap来实现对响应式数据和副作用函数建立联系，当没有引用关系的时候就会回收掉
- 解决了一些问题
  - 分支切换导致的冗余副作用
  - 嵌套的副作用--执行结束后弹出栈
  - 避免无限递归循环--在没执行完之前不修改activeEffect
  - 调度执行schedule--可以控制执行副作用函数的时机、次数、方式
    - 用于computed懒执行（手动执行）和watch的immediate（非立即执行则放到异步的微任务队列中）
  - 竞态问题--标记过期

# pinia和vuex

- Pinia 不仅提供了一个更简单的 API，也提供了符合组合式 API 风格的 API，最重要的是，搭配 TypeScript 一起使用时有非常可靠的类型推断支持


- *mutations* 不再存在。他们经常被认为是 **非常 冗长**。他们最初带来了 devtools 集成，但这不再是问题。
  - devtools用来捕捉mutation的快照，但无法获取异步的
- 无需要创建自定义的复杂包装器来支持 TypeScript，所有内容都是类型化的，并且 API 的设计方式尽可能利用 TS 类型推断
- 不再需要注入、导入函数、调用函数、享受自动完成功能
- 无需动态添加 Store，默认情况下它们都是动态的、自动的，也仍然可以随时手动使用 Store 进行注册
- 不存在module的概念，而是store的概念，每个store就是一个状态管理单元
  - 不再有 *modules* 的嵌套结构。仍然可以通过在另一个 Store 中导入和 *使用* 来隐式嵌套 Store，但 Pinia 提供平面结构，同时仍然支持 Store 之间的交叉组合方式。 **甚至可以拥有 Store 的循环依赖关系**
- 没有 *命名空间模块*。鉴于 Store 的扁平架构，“命名空间” Store 是其定义方式所固有的，您可以说所有 Store 都是命名空间的
  - 可以创建多个store，他们之间相互独立

# 组件通信

## 父子组件

- props/emits/parent/ref/attrs

## 兄弟组件

- parent/root/eventbus/vuex

## 跨层级

- eventbus/vuex/provide+inject

# vue中如何扩展一个组件

## 逻辑扩展

- mixins
  - 分发vue组件中可复用的功能
  - 混入对象的选项将被混入该组件本身的选项
- extends
  - 比如继承loading组件并挂载到body中的div上，将控制loading显隐的方法挂载到vue原型上
- composition api
  - vue3中的hooks，混入的数据和方法不能明确判断来源且可能和当前组件内变量产生命名冲突，此方法可以解决

## 内容扩展

- slots
  - 可以精确分发，用具名插槽；要使用子组件中的数据可以使用作用域插槽

# 子组件可以直接改变父组件的数据么

- 所有的 prop 都使得其父子之间形成了一个单向下行绑定
- 这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解
- emit一个事件让父组件去做这个变更
- 用$parent违反了单向数据流原则

# 虚拟dom

- 本身就是js对象，通过不同的属性描述视图结构
- 好处：将真实的元素节点抽象为VNode，减少直接操作dom的次数，提高性能，实现跨平台
- how：template模板被编译器compiler编译为渲染函数，在mount过程中调用render函数，返回虚拟dom对象，但还不是真的dom，在后续的patch过程中进一步转化为dom
- diff应用：更新流程，响应式数据变化，将组件重新render，生成新的vdom，通过diff找到变化并转换为最小量的dom操作，高效更新视图

# diff算法

- 又称patching算法，虚拟dom转换为真实dom
- vue2为了降低watcher的粒度，每个组件只有一个watcher，需要引入patching算法才能精确找到发生变化的地方并高效更新
- when：组件内响应式数据变更触发实例执行其更新函数时，更新函数重新执行render，获得最新的vdom，再执行patch，传入新旧vdom，对比找到变化，最后转换为真实dom
- how：patch是一个递归过程，遵循深度优先，同层比较策略

## vue2和vue3的区别

- vue2的diff算法对比的颗粒度是组件，需要遍历整个dom树，但其实有静态节点
- vue3添加了静态标记、静态提升和事件缓存，序列化为字符串，减少编译和渲染成本


# 页面权限控制

- 前端方案会把所有路由信息在前端配置，通过路由守卫要求用户登录，用户登录后根据角色过滤出路由表
  - 比如我会配置一个asyncRoutes数组，需要认证的页面在其路由的meta中添加一个roles字段，等获取用户角色之后取两者的交集，若结果不为空则说明可以访问。
  - 此过滤过程结束，剩下的路由就是该用户能访问的页面，最后通过router.addRoutes(accessRoutes)方式动态添加路由即可。
- 后端方案会把所有页面路由信息存在数据库中，用户登录的时候根据其角色查询得到其能访问的所有页面路由信息返回给前端，前端再通过addRoutes动态添加路由信息
- 按钮权限的控制通常会实现一个指令，例如v-permission，将按钮要求角色通过值传给v-permission指令，在指令的moutned钩子中可以判断当前用户角色和按钮是否存在交集，有则保留按钮，无则移除按钮

# computed实现原理

- 惰性lazy观察者，不会立即求值，也有dep实例，内部通过dirty属性标记是否重新求值，为true则计算，只有其他地方需要读取时才计算
- 也就是响应式数据发生改变时，会触发响应

# 微任务、宏任务

- js是单线程，任务分为同步和异步，异步包括宏任务和微任务
- 由于微任务一次可以执行多个，宏任务执行后立即清空微任务达到了“伪同步”的效果，在视图渲染起到重要作用
- 宏任务：
  - script（外层同步代码）
  - ajax
  - setTimeout、setInterval
  - postMessage、MessageChannel
  - setImmediate、I/O（node.js环境）
- 微任务
  - promise.then /catch/finally
  - process.nextTick（node.js环境）
- 宏任务执行完，判断是否有可执行的微任务，有则执行微任务，然后执行宏任务，没有则执行新的宏任务
- event loop在压入事件时，都会判断微任务队列是否有需要执行的事件，有则压入微任务，没有就依次压入需要执行宏任务

## promise、async和await

- promise作为函数是同步的且被立即执行

- ```js
   console.log(1);
   new Promise((resolve, reject) => {
      console.log(2);
      resolve(); // 触发 then 回调
      // reject(); // 触发 catch 回调
   }).then(()=>{
      console.log('then')
   }).catch(()=>{
      console.log('catch')
     }).finally(()=>{
      console.log('finally')
     })
   console.log(3);
     // 结果： 1 2 3 then finally
   ```
  ```

- async是通过Promise包装异步任务，同时，await后面的代码，会进入then微任务中

- ```js
  async function fun1() {
    console.log('fun1 start')//1
    await fun2(); // 等待 fun2 函数执行完成
    console.log('我是 await 后面的代码')//5
    console.log('fun1 end')//6
  }
  async function fun2() {
    console.log('fun2 start')//2
    console.log('fun2 end')//3
  }
  fun1()
  console.log('await 阻塞，导致 await后面代码进入 then 微任务')//4
  ```

## process.nextTick在事件循环中的处理

- 是node环境的变量，是一个特殊的异步api，不属于event loop阶段
- node遇到这个api时，event loop不会继续执行，会马上停下来执行nextTick，所以与promise同时出现时，会先执行nextTick
- 可以类比vue.$nextTick()

# vue渲染过程

- 调用compile函数，生成render函数字符串
  - parse函数解析template，生成ast（抽象语法树），即源代码的抽象语法结构的树状表现形式
  - optimize函数优化静态节点，generate函数生成render函数字符串
- 调用new Watcher函数，监听数据变化，当数据发生改变时，render函数生成vnode，调用patch方法，对比新旧vnode对象，通过dom diff算法，添加、移动、删除真实的dom元素

# keep-alive原理和缓存策略

- keep-alive包裹第一个字组件对象及其组件名，根据设定的include/exclude进行条件匹配，决定是否缓存
- 根据组件id和tag生成缓存key，并在缓存对象里查找是否已缓存过，有则直接取出，并更新该key在keys中的位置
- 在cache对象中存储该组件实例并保存key值，之后检查缓存的实例数量是否超过max设置值，超过则根据LRU（缓存淘汰算法）置换策略删除最近最久未使用的实例（即下标为0的key）
  - LRU（缓存淘汰算法）根据数据的历史访问记录来进行淘汰数据，核心思想是：如果数据最近被访问过，那么将来会被访问的几率也会很高
- 最后组件实例的keepAlive属性设置为true

# $set原理

- vue无法检测到对象属性的添加或删除，对于已经创建的实例，vue不允许动态添加根级别的响应式属性，但可以用$set方法向嵌套对象添加响应式属性

- ```ts
  export function set(target: Array | Object, key: any, val: any): any {
    // target 为数组
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      // 修改数组的长度, 避免索引>数组长度导致splice()执行有误
      target.length = Math.max(target.length, key);
      // 利用数组的splice变异方法触发响应式
      target.splice(key, 1, val);
      return val;
    }
    // target为对象, key在target或者target.prototype上 且必须不能在 Object.prototype 上,直接赋值
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val;
    }
    // 以上都不成立, 即开始给target创建一个全新的属性
    // 获取Observer实例
    const ob = (target: any).__ob__;
    // target 本身就不是响应式数据, 直接赋值
    if (!ob) {
      target[key] = val;
      return val;
    }
    // 进行响应式处理
    defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val;
  }
  ```

# 常见事件修饰符

- .stop等同于js中的event.stopPropagation()，防止事件冒泡

- .prevent等同于js中的event.preventDefault()，防止重载页面

  - ```html
    // 不会跳转到blog
    <a v-bind:href="blog" v-on:click.prevent="alert()">博客链接</a>
    ```

- `.capture` 捕获阶段触发，触发从外到内的事件

  - ```html
    <!-- HTML --> 
    <div id="app"> 
    　　<div class="outeer" @click.capture="outer"> 
    　　　　<div class="middle" @click.capture="middle"> 
    　　　　　　<button @click.capture="inner">点击我(^_^)</button>
     　　　　</div>
     　　</div> 
    </div>

    ```

- `.self` 自己本身上面触发

- `.once` 一次性绑定

- `.passive` 一般给scroll或者resize事件绑定，等到调整完成之后触发。

- 注意事件顺序，.prevent.self会阻止所有的，而.self.prevent是阻止自身的

- `.native`修饰符：给组件绑定原生事件无效时，可以用这个让组件上的原生事件生效

- `.sync`是v-model的另一种使用方式，是用update实现，可以实现子组件和父组件的双向绑定

  - ```html
    <!-- 父组件 -->
    <text-document
      v-bind:title="doc.title"
      v-on:update:title="doc.title = $event"
    ></text-document>
    可以修改为：
    <text-document
      v-bind:title.sync="doc.title"
    ></text-document>
    ```

# `$attrs`和`$listeners`的使用场景

- `$attrs`: 包含了父作用域中（组件标签）不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。 在创建基础组件时候经常使用，可以和组件选项`inheritAttrs:false`和配合使用在组件内部标签上用`v-bind="$attrs"`将非prop特性绑定上去；
- `$listeners`: 包含了父作用域中（组件标签）的 (不含`.native`) v-on 事件监听器。 在组件上监听一些特定的事件，比如focus事件时，如果组件的根元素不是表单元素的，则监听不到，那么可以用`v-on="$listeners"`绑定到表单元素标签上解决。

# EventBus注册在全局上时，路由切换时会重复触发事件，如何解决呢

- 在有使用`$on`的组件中要在`beforeDestroy`钩子函数中用`$off`销毁。

# Vue项目中如何配置favicon

- 静态配置 `<link rel="icon" href="<%= BASE_URL %>favicon.ico">`

  - 其中`<%= BASE_URL %>`等同vue.config.js中`publicPath`的配置;

- 动态配置

  - ```js
    import browserImg from 'images/kong.png';//为favicon的默认图片
    const imgurl ='后端传回来的favicon.ico的线上地址'
    let link = document.querySelector('link[type="image/png"]');
    if (imgurl) {
        link.setAttribute('href', imgurl);
    } else {
        link.setAttribute('href', browserImg);
    }
    ```

  - ```html
    <link rel="icon" type="image/png" href="">
    ```

# vue2为什么要求组件模板只能有一个根元素

- 当前的virtualDOM差异和diff算法在很大程度上依赖于每个子组件总是只有一个根元素。

# 单向数据流和双向数据流的理解

- 单向数据流是指数据只能从父级向子级传递数据，子级不能改变父级向子级传递的数据。
- 双向数据流是指数据从父级向子级传递数据，子级可以通过一些手段改变父级向子级传递的数据。
- 比如用`v-model`、`.sync`来实现双向数据流。

# vue-route使用

- router/index.js配置文件

- ```js
  import Vue from 'vuex'
  import Router  from "vue-router"
  Vue.use(Router)
  // 定义路由映射
  const routes = [
    {
      path:"/地址",component:()=>import('组件位置路径')
    }
  ]
  // 创建路由实例
  const router = new Router({
    routes,
  })
  // 暴露
  export default router;
  ```

- main.js注入vue实例

  ```js
  import router from './router'
  new Vue({
    ...,
    router,  // 一旦注入，所有组件中都有$router和$route; $router表示路由对象实例； $route表示当前页面路由信息
    ...
  })
  ```

- App.vue中操作出口

- `<router-view></router-view>`实现视图渲染，像个占位组件

  - 根据其所在深度deep，在匹配数组结构找到路由、获取组件并渲染
  - 可以用name属性命名，多个router-view渲染多个组件到不同的router-view中展示
  - 可以嵌套使用，即嵌套路由配置中有children

- `<router-link to="/地址"></router-link>`是给用户交互，来触发路由的变化，比如导航栏

  - 内部提供导航方法，调用方法就会修改响应式路由变量，重新在routes匹配

# 编程式导航方法

- 路由实例中$router访问

- this.$router.push('/地址') 跳转到某个新地址，历史记录栈中增加一个
- this.$router.replace('/地址') 跳转到某个地址，新地址替换当前地址在历史记录中的位置
  - 不会向history栈添加，点击返回后会跳转到上上个页面，被替换的页面没有记录
- this.$router.go(数字) 正数前进几步；负数后退几步；0表示刷新
- this.$router.back() 后退
- this.$router.forward() 前进

# 实现面包屑导航

- **this.$route.matched（记录路由匹配过程）**获取后，过滤不包含meta.title的项，生成新的面包屑导航数组
  - meta的作用，告诉机器如何解析这个页面，常用有charset、http头部、seo优化、viewport移动端布局
- 判断matched第一项是否为dashboard，不是则添加dashboard为面包屑导航第一项
- 再过滤matched中meta.title为空的项和 item.meta.breadcrumb 为false的项

# 页面之间如何传参

- 本地存储
- 动态路由
- query传参
- hash传参
- vue存储和读取

# vue-router有哪几种导航钩子？

- 全局导航钩子：router.beforeEach((to,from,next)=>{})、router.afterEach((to, from) => { ... })

- 组件内的钩子：

  - `beforeRouteEnter(to, from, next) { ... }`
  - `beforeRouteUpdate (to, from, next) {...}`
  - `beforeRouteLeave (to, from, next) {...}`

- 单独路由独享组件

  - ```js
    const router = new VueRouter({
      routes: [
        {
          path: '/foo',
          component: Foo,
          beforeEnter: (to, from, next) => {  // 配置在路由映射里面
            // ...
          }
        }
      ]
    })
    ```

# route和route和router的区别

- $route是“路由信息对象”
  - path 路径地址
  - params 动态路由数据
  - hash hash数据
  - query search数据
  - fullPath 完整地址
  - matched 路由匹配 （可用于制作面包屑）
  - name 路由名称
- $router是“路由实例”对象包括了路由的跳转方法，钩子函数等
  - push/replace/go/back/forward
  - beforeEach/afterEach/...
  - addRoutes 方法，增加映射

# 路由元信息是什么？有何作用？

- 设置每个路由映对象的时候，可以增加一个meta属性，里面可以自定义相关数据

- ```js
  // 路由映射
  {
  	path:'/地址',
  	component: ()=>import(组件地址),
  	meta:{
  	 	属性名:"属性值",
  	 	....
  	}
  }
  ```

- 组件中读取： **this.$route.meta.属性名**

- 作用：

  - 可以通过这个设置标题，在拦截器里面进行设置；
  - meta里面放入权限验证字段，判断是否有权限访问页面

# 如何实现页面的过渡效果

- transition组件

  - ```vue
    <transition>
      <router-view></router-view>
    </transition>
    ```

- transition起作用的时机

  - 条件渲染（使用 v-if）
  - 条件展示（使用了 v-show）
  - 动态组件
  - 组件根节点

- 内部会发生什么：`<transition name="box"></transition>`

  - 进入：
  - 添加 .box-enter
  - 删除 .box-enter，添加 .box-enter-active
  - 删除 .box-enter-active
  - 离开：
  - 添加 .box-leave
  - 删除 .box- leave，添加 .box- leave-active
  - 删除 .box- leave -active

- 可以在css中定义

- ```
  .box-enter-active,.box-leave-active{
      transition: all .8s;
   }
  ```

- mode可以控制过度的时间序列`transition mode="in-out"`

# 路由懒加载

- 因为打包构建应用的时候，js会很大，影响页面加载
- 如果把不同路由对应的组件分割成不同代码块，然后当路由被访问的时候才加载对应组件，这样更高效

```js
// 路由映射
{
	path:'/地址A',
	component: ()=>import(组件地址)   // 懒加载
}
```

# 路由模式（路由实现原理/SPA单页面实现方式）

## history

- 原理：h5的history里面的api，比如pushState和replaceState

- 这种模式充分利用 `history.pushState` API 来完成 URL 跳转而无须重新加载页面。

- 不过需要后台配合，因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 `http://oursite.com/user/id` 就会返回 404

- 要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 `index.html` 页面，这个页面就是你 app 依赖的页面

- 即history模式需要后台配置，否则会和真正的服务器端路由地址冲突

- 处理滚动行为

  - ```js
    new VueRouter({
    	...,
         // savedPosition 这个参数当且仅当导航 (通过浏览器的 前进/后退 按钮触发) 时才可用  效果和 router.go() 或 router.back()
    	scrollBehavior (to, from, savedPosition) {
          // 返回savedPosition 其实就是 当用户点击 返回的话，保持之前游览的高度
          if (savedPosition) {
            return savedPosition
          } else {
            return { x: 0, y: 0 }
          }
        },
        ...
    })
    ```

## hash

- 原理：监听window的hashchange事件，展示不同组件

- 处理滚动行为

  - ```js
    router.beforeEach((to,from,next)=>{
    	// 直接使用window的scroll方法滚动回顶部
    	window.scrollTo(0,0)
    	next()
    })
    ```

# 实现刷新页面

- 给router-view添加v-if，控制组件重新渲染
- 采用window.reload或者router.go(0)刷新，整个浏览器进行了重新加载，闪烁，体验不好
- 可以先跳转到一个空页面，然后马上跳转回来

# 如何实现路由标签页

- 有一个数组，用于存储打开过的标签信息// 数组格式： [{ name:'名称',path:'/地址' },...]
- 增加，用watch监听$route变化，有变化则插入数组，需要判断是否存在
- 删除，删除所有则直接赋空；删除其他就赋值一个元素；删除单个则判断是否为激活项，是则判断是否还有长度，没有则跳转默认地址，有则判断删除元素下标是否为0，是则展示右边内容，否则展示左边内容

# 完整的vue-router导航解析流程

1. 导航被触发
2. 在失活组件中调用beforeRouteLeave
3. 调用全局beforeEach
4. 在复用组件里调用beforeRouteUpdate
5. 带哦用路由配置里的beforeEnter
6. 解析异步路由组件
7. 在被计获的组件里调用beforeRouteEnter
8. 调用全局beforeResolve
9. 导航被确认
10. 调用全局afterEach
11. dom更新
12. 用创建好的实例调用beforeRouteEnter守卫中传给next的回调函数

# 切换路由时，需要保存草稿的功能

- ```
  <keep-alive :include="include">
      <router-view></router-view>
   </keep-alive>
  ```

- 其中include可以是个数组，数组内容为路由的name选项的值。

# vuex和本地存储的区别

- vuex刷新就丢失，本地存储一直在
- vuex可以实时更新，本地存储不行

# vuex是什么

- vuex是专为vue.js应用程序开发的状态管理插件
- 采用集中式存储管理应用的所有组件的状态，而更改状态的唯一方法是提交mutation
- 解决了兄弟组件之间的状态传递
- vuex引用流程：
  - 安装vuex
  - 在src中建立store
  - 在store中新建index.js，包括vue.use(vuex)，创建vuex.store实例，包括state、getters、mutations、actions
  - 在main.js中引入，vue实例里添加store:store

# 如何批量使用vuex的state状态

- 使用mapState辅助函数，利用对象展开运算符将state混入computed对象中

- ```vue
  import {mapState} from 'vuex'
  export default{
      computed:{
          ...mapState(['price','number'])
      }
  }
  ```

- 同理批量使用getters可以用mapGetters

# Vuex中action和mutation的区别

- action提交的是mutation，而不是直接变更状态，mutation可以直接变更状态

- action可以包含任意异步操作，mutation只能是同步操作

- 提交方式不同，action用的store.dispatch('ACTION_NAME',data)来提交，mutation是用store.commit('SET_NUMBER',data)来提交

  - 此外的相同点，他们都接收第二个外部传来的参数data

- 接参不同，mutation第一个参数是state，action第一个是context

  - context包括

  - ```js
    {
        state,      // 等同于 `store.state`，若在模块中则为局部状态
        rootState,  // 等同于 `store.state`，只存在于模块中
        commit,     // 等同于 `store.commit`
        dispatch,   // 等同于 `store.dispatch`
        getters,    // 等同于 `store.getters`
        rootGetters // 等同于 `store.getters`，只存在于模块中
    }
    ```

# vuex命名空间

- 默认情况下，模块内部的action、mutation、getter是注册在全局命名空间的，如果多个模块中action、mutation、getter的命名一样，那么提交时会触发所有模块命名相同的mutation、action，即耦合性强

- 如果想要有更高的封装度和复用性，可以用namespaced：true使其成为带命名空间的模块

- ```js
  export default{
      namespaced: true,
      state,
      getters,
      mutations,
      actions
  }
  ```

- 如果有带命名空间，但是想要提交到全局，则第三个参数是` { root: true }` 

- ```js
  this.$store.dispatch('actionA', null, { root: true })
  this.$store.commit('mutationA', null, { root: true })
  ```

- 要在带namespaced的模块内注册全局action，则带上root属性

- ```js
  actions: {
      actionA: {
          root: true,  // 带上root为true表示就是根的action了
          handler (context, data) { ... }
      }
    }
  ```

- 提交modules中带namespaced的moduleA中的mutationA

- ```js
  this.$store.commit('moduleA/mutationA',data)
  ```

- 将vuex批量处理函数绑定namespaced，**使用createNamespacedHelpers创建基于某个命名空间辅助函数**

- ```js
  import { createNamespacedHelpers } from 'vuex';
  const { mapState, mapActions,mapGetters,mapMutations } = createNamespacedHelpers('moduleA');
  export default {
      computed: {
          // 在 `module/moduleA` 中查找
          ...mapState({
              a: state => state.a,
              b: state => state.b
          }),
          ...mapGetters(['getterA','getterB'])
      },
      methods: {
          // 在 `module/moduleA` 中查找
          ...mapActions([
              'actionA',
              'actionB'
          ])，
          ...mapMutations([
          	'mutationA',
          	'mutationB'
          ])
      }
  }
  ```


# vue等单页面应用及其优缺点

## 优点

- 无刷新体验,提升了用户体验
- 前端开发不再以页面为单位，更多地采用组件化的思想，代码结构和组织方式更加规范化，便于修改和调整
- API 共享，同一套后端程序代码不用修改就可以用于Web界面、手机、平板等多种客户端 用户体验好、快，内容的改变不需要重新加载整个页面

## 缺点

- 不支持低版本的浏览器，最低只支持到IE9
- 不利于SEO的优化（如果要支持SEO，建议通过服务端来进行渲染组件）
- 第一次加载首页耗时相对长一些
- 不可以使用浏览器的导航按钮需要自行实现前进、后退


# vue中data的作用

- 为了保证每个vue实例都有自己独立的数据对象，采用**data函数**的形式，这样每次创建组件实例时，这个函数都会被调用，返回一个新的数据对象，**避免数据污染和冲突**
- 功能
  - 存储组件内部数据
  - 实现数据双向绑定
  - 提供组件的初始状态
  - 利用计算属性对数据进行处理
  - 实现组件间的数据共享