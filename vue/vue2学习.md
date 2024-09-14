# 组件化应用构建

-    <div id="app">
          <todo-item></todo-item>
      </div>
      
      <script>
          var data = {message : 1}
          Vue.component('todo-item', {
              template: '<div>这是个待办事项</div>'
          });
          var app = new Vue({
          	el: '#app'
          });
      </script>
- 开发阶段，html中要求引入vue.js文件(head/body中都可)
-    <script src="vue.js" type="text/javascript" charset="utf-8"></script>

Vue实例创建及其响应式系统

-     <div id="app">
     {{message}}
      </div>
      <script>
        var data = {message : 1}
        var app = new Vue({
          el: '#app',
          data: data
        });
        data.message = "hi vue"
        app.message = "test"
        console.log(data.message == app.message);//true
      </script>
- 但要求实例创建时已经在data中定义的数据才是响应式的
- app.b = "b"
     console.log(data.b);//undefined
- 例外：Object.freeze(obj)会使现有prop无法修改
- var obj = {
     foo: 'bar'
      }

      Object.freeze(obj)

      new Vue({
          el: '#app',
          data: obj
      });
  - 比如定义button修改foo，不会出现更改

# v-once：一次性插值

-     <span v-once>这个无法改变：{{msg}}</span>

# 动态参数

-    <div id="app">
          <a v-bind:[attributename]="url">to test2</a>
          <a v-bind:href="url">to test2</a>
          <a href="Test2.html">11</a>
      </div>
      <script>
          new Vue({
            el: '#app',
            data: {
              attributename: "href",
              url: "Test2.html"
            }
          });
      </script>
- []方括号中的值不能有大写，否则失效，因为浏览器会把attribute名都强制转换为小写，找不到实例中同名的属性

# 计算属性不再更新的情况

-    computed: {
     reversedMessage: function () {
     	return this.message.split('').reverse().join('')
     },
     now: function () {
     	return Date.now()
     }
      }
- 因为Date.now()不是响应式依赖，与message不一样

# 计算属性的setter

-    var vm = new Vue({
          el: '#example',
          data: {
              message: "hello",
              now: '',
              firstName: 'foo',
              lastName: 'bar',
          },
          computed: {
              fullName: {
                get: function () {
                	return this.firstName + ' ' + this.lastName
                },
                set: function (params) {
                  var name = params.split(' ')
                  this.firstName = name[0]
                  this.lastName = name[name.length - 1]
                }
              }
          }	
      });
      //调用了set，last和first都会被相应改变
      vm.fullName = 'John Doe'

# Class和Style绑定

- 对象语法Class
  -     <div v-bind:class="classObject"></div>
  -     data: {
       classObject: {
         active: true,
         'text-danger': false
       }
        }
  - 结果为
  - <div class="static active"></div>
- 对象语法Style类似
- 数组语法Class
  - 结果位为<div class="active text-danger"></div>
  - 所有的前提条件都是isActive为truthy
    - truthy
    - 在 JavaScript 中，truthy（真值）指的是在布尔值上下文中，转换后的值为 true 的值。被定义为假值以外的任何值都为真值。（即所有除 false、0、-0、0n、""、null、undefined 和 NaN 以外的皆为真值）。
- 数组语法Style类似

# v-show的限制

- 它不支持<templete>元素，也不支持 v-else。

# v-if和v-for永远不要一起用在同一元素上

- 为了避免，应将v-if转换为计算属性，或者移动到容器元素上（如ul、ol）

# v-for使用对象

-     <div v-for="(value, name, index) in object">
     {{ index }}. {{ name }}: {{ value }}
      </div>
- 会按 Object.keys() 的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下都一致

# 变更方法

- push() 末尾添加一个或多个元素
  -     let arr = ['a', 'b', 'c', 'd']
       console.log(arr)  // ["a", "b", "c", "d"]
       console.log(arr.push('new')) //6
       console.log(arr) // ["a", "b", "c", "d", "new"]
- pop() 最后一位元素删除并返回数组的最后一个元素
  -     let arr = ['a', 'b', 'c', 'd']
       console.log(arr)  // ["a", "b", "c", "d"]
       console.log(arr.pop()) //d
       console.log(arr) // ["a", "b", "c"]
- shift() 把数组的第一个元素从其中删除，并返回第一个元素的值
  -     let arr = ['a', 'b', 'c', 'd']
       console.log(arr)  // ["a", "b", "c", "d"]
       console.log(arr.shift()) //a
       console.log(arr) // ["b", "c", "d"]
- unshift() 向数组的开头添加一个或更多元素，并返回新的长度
  -     let arr = ['a', 'b', 'c', 'd']
       console.log(arr)  // ["a", "b", "c", "d"]
       console.log(arr.unshift('new')) //6
       console.log(arr) // ["new","a", "b", "c", "d"]
- splice(index,howmany,item1, …, itemX) 向/从数组中添加/删除项目，然后返回被删除的项目
  - 第一个参数：表示从哪个索引位置（index）添加/删除元素
    第二个参数：要删除的项目数量。如果设置为 0，则不会删除项目。
    第三个参数：可选。向数组添加的新项目。
  - let arr = ['a', 'b', 'c', 'd']
       arr.splice(1, 2, '1', '2')
       console.log(arr) // ["a", "1", "2", "d"]
- sort() 对原列表进行排序，如果指定参数，则使用比较函数指定的比较函数
  -     function sortNumber (a, b) {
       return a - b
        }
        let arr = [10,5,40,25,1000,1]
        arr.sort(sortNumber)
        console.log(arr) // [1, 5, 10, 25, 40, 1000]
- reverse() 方法颠倒数组中元素的顺序

# 替换数组

- filter()、concat() 和 slice()
- 它们不会变更原始数组，而总是返回一个新数组。当使用非变更方法时，可以用新数组替换旧数组
- example1.items = example1.items.filter(item => item.message.match(/Foo/))
- 用一个含有相同元素的数组去替换原来的数组是非常高效的操作

# 检测变化的注意事项

- Vue 不能检测数组和对象的变化
- 对于对象，无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的
  - 对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式 property
  - 还可以使用 vm.$set 实例方法
  - 使用 Object.assign() 或 _.extend()添加到对象上的新 property 不会触发更新
    -     // 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
         this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
- 对于数组，Vue 不能检测以下数组的变动：
  1. 当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
  2. 当你修改数组的长度时，例如：vm.items.length = newLength
- 解决
  - vm.$set(vm.items, indexOfItem, newValue)
  - vm.items.splice(newLength)

# Vue.extend()

-    <div id="mount-point"></div>
     // 创建构造器
     var Profile = Vue.extend({
       template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
       data: function () {
         return {
           firstName: 'Walter',
           lastName: 'White',
           alias: 'Heisenberg'
         }
       }
     })
     // 创建 Profile 实例，并挂载到一个元素上。
     new Profile().$mount('#mount-point')

     // 结果如下：
     <p>Walter White aka Heisenberg</p>
- 作用：从接口动态渲染组件；实现一个类似于 window.alert() 提示组件要求像调用 JS 函数一样调用它

# 解析DOM模板时的注意事项

- 有些 HTML 元素，诸如 <ul>、<ol>、<table> 和 <select>，对于哪些元素可以出现在其内部是有严格限制的。而有些元素，诸如 <li>、<tr> 和 <option>，只能出现在其它某些特定的元素内部。
- <table>
     <blog-post-row></blog-post-row>
      </table>
- 自定义组件 <blog-post-row> 会被作为无效的内容提升到外部，并导致最终渲染结果出错
- <table>
     <tr is="blog-post-row"></tr>
      </table>
- is attribute可以解决问题
  - 如果我们从以下来源使用模板的话，这条限制是不存在的：
    - 字符串 (例如：template: '...')
    - 单文件组件 (.vue)
    - <script type="text/x-template" id="hello-world-template">

# 组件注册

- 组件名
  - kebab-case：短横线分隔命名
- 全局注册
  -    Vue.component('component-a', { /* ... */ })
       Vue.component('component-b', { /* ... */ })
       Vue.component('component-c', { /* ... */ })

       new Vue({ el: '#app' })
  - 使用
    -     <div id="app">
         <component-a></component-a>
         <component-b></component-b>
         <component-c></component-c>
          </div>
- 全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生

# Prop单向数据流

- 只能向下绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行

# Prop验证

- type：
  - String
  - Number
  - Boolean
  - Array
  - Object
  - Date
  - Function
  - Symbol
- prop 会在一个组件实例创建之前进行验证，，所以实例的 property (如 data、computed 等) 在 default 或 validator 函数中是不可用的

# 禁止attribute继承

- 在组件的选项中设置 inheritAttrs: false

# 条件渲染，用key管理可复用的组件

- 可以重新把原有的input框清空
- 尽量加上，因为在实际运用中会出现校验出错不生效

# 冒泡事件与.stop

- 当点击子元素时，父元素也有点击事件，那么事件就会一个个从里向外执行，像冒泡一样
- .stop就是用来使其在某个元素上停止 不再继续冒泡

# @keyframes定义一个动画，animation执行

-     .bounce-enter-active {
     animation: bounce-in .5s;
      }
      .bounce-leave-active {
        animation: bounce-in .5s reverse;
      }
      @keyframes bounce-in {
        0% {
          transform: scale(0);
        }
        50% {
          transform: scale(1.5);
        }
        100% {
          transform: scale(1);
        }
      }
  - animation预设了抖动（shake）、闪烁（flash）、弹跳（bounce）、翻转（flip）、旋转（rotateIn/rotateOut）、淡入淡出（fadeIn/fadeOut）等多达 60 多种动画效果，几乎包含了所有常见的动画效果
  - 可以在github中下载

# transform基本用法

- 1.移动translate值为水平方向移动的位移，也有xyz轴的表示方式
- 2.旋转rotate值为旋转度数，正数为顺时针，可2D旋转和3D旋转
- 3.缩放scale一个值是水平和垂直同时放大n倍
- 4.倾斜skew第一个参数表示水平方向的倾斜角度，第二个参数表示垂直方向的倾斜角度
- 5.元素的基点transform-origin第一个表示距离元素左上角水平方向的距离，第二个表示距离元素左上角垂直方向的距离

# transition和animation的区别

- 有时候animation很快触发并完成，但transition效果还没结束，因此需要使用type attribute来设置animation或transition来声明需要vue监听的类型
- transition可以用duration属性来定义过渡持续时间

# js钩子enter/leave

- 可以结合transitions/animations 使用，也可以单独使用
- 当只用js过渡时，它们最后必须使用done回调，否则会同步调用，过渡立即完成
- 可以给过渡元素添加 v-bind:css="false"，跳过css检测，避免过渡过程中css的影响

# 混入：选项合并

- 当组件和混入对象有同名选项时，这些选项将以恰当的方式进行合并
- 比如，发生冲突的内部属性，会以组件数据优先，混入对象其次
- 同名的钩子函数合并为一个数组，都会被调用，且混入对象的钩子在组件自身钩子之前调用
-    // 定义一个混入对象
     var mixins = {
       data: function () {
         return {
           message: "hello",
           foo: 'abc'
         }
       },
       created: function () {
         this.hello()
       },
       methods: {
         hello: function () {
           console.log('hello from mixin!')
         }
       }
     }

     // 定义一个使用混入对象的组件
     new Vue({
       mixins: [mixins],
       data: function () {
         return {
           message: 'goodbye',
           bar: 'def'
         }
       },
       created: function () {
         console.log(this.$data);

       }
     })
- 值为对象的选项，例如methods，components，directives会被合并为一个对象，两个对象键名冲突，取组件对象的键值对
