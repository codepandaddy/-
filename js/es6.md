## let不允许在相同作用域内重复声明

- ```js
  // 报错
  function func() {
    let a = 10;
    var a = 1;//变量提升
  }

  // 报错
  function func() {
    let a = 10;
    let a = 1;
  }
  ```

- ```js
  function func(arg) {
    let arg;//没有变量提升，不重复赋值
  }
  func() // 报错Identifier 'arg' has already been declared

  function func(arg) {
    {
      let arg;
    }
  }
  func() // 不报错
  ```

## 函数在块级作用域的使用

- ```js
  // 浏览器的 ES6 环境，报错！
  function f() { console.log('I am outside!'); }
  (function () {
    //类似var f = undefined;
    if (false) {
      // 重复声明一次函数f
      function f() { console.log('I am inside!'); }
    }
    f();
  });
  // Uncaught TypeError: f is not a function
  ```

- good

- ```js
  // 块级作用域内部，优先使用函数表达式
  {
    let a = 'secret';
    let f = function () {
      return a;
    };
  }
  ```

- 大括号是必须的，js引擎用它来判断是否有块级作用域

## const和let的作用域规则一样

## 顶层对象的属性

- 顶层对象，在浏览器环境指的是`window`对象，在 Node 指的是`global`对象。ES5 之中，顶层对象的属性与全局变量是等价的。

- ES6中，var和function依然是顶层对象的属性，但let、const、class声明的全局变量，不再属于顶层对象的属性

- ```js
  var a = 1;
  // 如果在 Node 的 REPL 环境，可以写成 global.a
  // 或者采用通用方法，写成 this.a
  window.a // 1

  let b = 1;
  window.b // undefined
  ```

  - 上面代码中，全局变量`a`由`var`命令声明，所以它是顶层对象的属性；全局变量`b`由`let`命令声明，所以它不是顶层对象的属性，返回`undefined`。

## globalThis对象

- 同一段代码为了能够在各种环境，都能取到顶层对象，现在一般是使用`this`关键字，但是有局限性。
  - 全局环境中，`this`会返回顶层对象。但是，Node.js 模块中`this`返回的是当前模块，ES6 模块中`this`返回的是`undefined`。
  - 函数里面的`this`，如果函数不是作为对象的方法运行，而是单纯作为函数运行，`this`会指向顶层对象。但是，严格模式下，这时`this`会返回`undefined`。
  - 不管是严格模式，还是普通模式，`new Function('return this')()`，总是会返回全局对象。但是，如果浏览器用了 CSP（Content Security Policy，内容安全策略），那么`eval`、`new Function`这些方法都可能无法使用。

## 数组解构赋值（不能使用圆括号）

- let [foo, [[bar], baz]] = [1, [[2], 3]]

  console.log(foo);//1

  console.log(bar);//2

  console.log(baz);//3

- let [, [[], baz]] = [1, [[2], 3]]

  console.log(baz);//3

- let [head, ...tail] = [1, [[2], 3]]

  console.log(head);//1

  console.log(tail);//[[2],3]

- ```js
  let [x, y, ...z] = [1]
  console.log(x); //1
  console.log(y); //undefined
  console.log(z); //[]
  ```

- ```js
  let [a, [b], d] = [1, [2, 3], 4];
  a // 1
  b // 2
  d // 4
  ```

- 要求等号右边必须是可遍历数组（具备Iterator接口）

- 也可以用于对象，**变量必须与属性同名，才能取到正确的值**

- 默认值：必须严格===undefined才能默认赋值

  - ```js
    let [x = 1] = [undefined];
    x // 1

    let [x = 1] = [null];
    x // null
    ```

  - 参数解构undefined

    - ```js
      //函数move的参数是一个对象，通过对这个对象进行解构，得到变量x和y的值。如果解构失败，x和y等于默认值。
      function move({x = 0, y = 0} = {}) {
        return [x, y];
      }
      //为函数move的参数指定默认值，而不是为变量x和y指定默认值，所以会得到与前一种写法不同的结果。
      function move({x, y} = { x: 0, y: 0 }) {
        return [x, y];
      }
      // 函数没有参数的情况
      m1() // [0, 0]
      m2() // [0, 0]

      // x 和 y 都有值的情况
      m1({x: 3, y: 8}) // [3, 8]
      m2({x: 3, y: 8}) // [3, 8]

      // x 有值，y 无值的情况
      m1({x: 3}) // [3, 0]
      m2({x: 3}) // [3, undefined]

      // x 和 y 都无值的情况
      m1({}) // [0, 0];
      m2({}) // [undefined, undefined]

      m1({z: 3}) // [0, 0]
      m2({z: 3}) // [undefined, undefined]
      ```

- 用途：

  - 交换变量的值
  - 从函数返回多个值
  - 函数参数的定义
  - 提取json数据
  - 函数参数的默认值
  - 遍历Map结构
  - 输入模块的指定方法

## function* 声明函数

- 定义一个**生成器函数** (generator function)，它返回一个 [`Generator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator) 对象

- 语法：function* name([param[, param[, ... param]]]) { statements }

- 调用一个**生成器函数**并不会马上执行它里面的语句，而是返回一个这个生成器的 **迭代器** **（ iterator ）对象**。当这个迭代器的 `next()` 方法被首次（后续）调用时，其内的语句会执行到第一个（后续）出现`yield`的位置为止，`yield`后紧跟迭代器要返回的值。或者如果用的是 `yield*`（多了个星号），则表示将执行权移交给另一个生成器函数（当前生成器暂停执行）。

- 调用 `next()`方法时，如果传入了参数，那么这个参数会传给**上一条执行的 yield 语句左边的变量**

- ```js
  function* gen(){
      yield 10;
      x=yield 'foo';
      yield x;
  }

  var gen_obj=gen();
  console.log(gen_obj.next());// 执行 yield 10，返回 10
  console.log(gen_obj.next());// 执行 yield 'foo'，返回 'foo'
  console.log(gen_obj.next(100));// 将 100 赋给上一条 yield 'foo' 的左值，即执行 x=100，返回 100
  console.log(gen_obj.next());// 执行完毕，value 为 undefined，done 为 true
  ```

- yield*

  - ```js
    function* anotherGenerator(i) {
      yield i + 1;
      yield i + 2;
      yield i + 3;
    }

    function* generator(i){
      yield i;
      yield* anotherGenerator(i);// 移交执行权
      yield i + 10;
    }

    var gen = generator(10);

    console.log(gen.next().value); // 10
    console.log(gen.next().value); // 11
    console.log(gen.next().value); // 12
    console.log(gen.next().value); // 13
    console.log(gen.next().value); // 23
    ```

## 字符串扩展

- unicode码点超出范围，使用{}把码点括起来

- for of遍历字符串，正确识别码点（哪怕大于0xFFFF）

- JSON.stringify()为了确保返回的是合法的UTF-8字符，如果遇到`0xD800`到`0xDFFF`之间的单个码点，或者不存在的配对形式，它会返回转义字符串"\\\uD834"，留给应用自己决定下一步的处理

- 标签（函数）模板：第一个参数是字符串，不可以发生替换，之后的参数才发生替换

  - ```js
    let a = 5;
    let b = 10;
    function tag(s, v1, v2) {
      console.log(s[0]);
      console.log(s[1]);
      console.log(s[2]);
      console.log(v1);
      console.log(v2);
      return "ok";
    }
    tag`Hello ${a + b} world ${a * b}`;
    // 等同于
    tag(['Hello ', ' world ', ''], 15, 50);
    // "Hello "
    // " world "
    // ""
    // 15
    // 50
    // "OK"
    ```

  - 标签模板的重要应用，过滤html字符串，防止用户输入恶意内容；以及多语言转换（国际化处理）

## String.fromCodePoint()

- 用于从 Unicode 码点返回对应字符
- 方法定义在`String`对象上

## 实例的codePointAt()

- 正确返回 32 位的 UTF-16 字符的码点

  - ```js
    let s = '𠮷a';
    for (let ch of s) {
      console.log(ch.codePointAt(0).toString(16));
    }
    ```

- 定义在字符串的实例对象上

## String.raw()

- 该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，往往用于模板字符串的处理方法。

- ```js
  // `foo${1 + 2}bar`
  // 等同于
  String.raw({ raw: ['foo', 'bar'] }, 1 + 2) // "foo3bar"
  ```

## 实例的`normalize()`

- 用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化

- ```js
  '\u01D1'==='\u004F\u030C' //false
  '\u01D1'.normalize() === '\u004F\u030C'.normalize()
  // true
  ```

## String的其他方法

- 实例方法：includes(), startsWith(), endsWith() 可代替indexOf
- 实例方法：repeat(n)返回新字符串，表示原字符串重复n次
- 实例方法：padStart()，padEnd()
  - `padStart()`用于头部补全，`padEnd()`用于尾部补全。
  - 第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。
- 实例方法：trimStart()，trimEnd()
  - `trimStart()`消除字符串头部的空格，`trimEnd()`消除尾部的空格。它们返回的都是新字符串，**不会修改**原始字符串。
- 实例方法：replaceAll() -- 具体用法见https://es6.ruanyifeng.com/#docs/string-methods#%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95%EF%BC%9AreplaceAll
- 实例方法：at()接受一个整数作为参数，返回参数指定位置的字符，支持负索引（即倒数的位置）

## 正则u修饰符、y修饰符、s修饰符

- u：Unicode 模式，正确处理大于`\uFFFF`的 Unicode 字符

- ```js
  /𠮷{2}/.test('𠮷𠮷') // false
  /𠮷{2}/u.test('𠮷𠮷') // true
  ```

- y：“粘连”（sticky）修饰符，与`g`修饰符类似，也是全局匹配

  - 不同之处在于，`g`修饰符只要剩余位置中存在匹配就可，而`y`修饰符确保匹配必须从剩余的第一个位置开始

  - ```js
    var s = 'aaa_aa_a';
    var r1 = /a+/g;
    var r2 = /a+/y;

    r1.exec(s) // ["aaa"]
    r2.exec(s) // ["aaa"]
    //执行完后，剩余字符串都为_aa_a
    r1.exec(s) // ["aa"]
    r2.exec(s) // null，y又从头部开始匹配
    ```

- s：dotAll模式，点（dot）代表一切字符

## 先行断言和后行断言

- 先行断言：/x(?=y)/ 匹配'x'仅仅当'x'后面跟着'y'


- ```js
  /\d+(?=%)/.exec('100% of US presidents have been male')  // ["100"]
  /\d+(?!%)/.exec('that’s all 44 of them')                 // ["44"]
  ```

- 后行断言：

- ```js
  /(?<=\$)\d+/.exec('Benjamin Franklin is on the $100 bill')  // ["100"]
  /(?<!\$)\d+/.exec('it’s is worth about €90')                // ["90"]
  ```

  - 反斜杠引用，也与通常的顺序相反，必须放在对应的那个括号之前

    - \1的数字1表示，第一个括号内的值匹配一个；\1+表示，第一个括号内的值匹配>=1个；\1*表示，第一个括号内的值匹配0到多个；\2表示，第二个括号内的值匹配单个

  - ```js
    /(?<=(o)d\1)r/.exec('hodor')  // null
    /(?<=\1d(o))r/.exec('hodor')  // ["r", "o"]
    ```

  - 因为后行断言是先从左到右扫描，发现匹配以后再回过头，从右到左完成反斜杠引用。

## 具名匹配

- 在圆括号内部，模式的头部添加“问号 + 尖括号 + 组名”（`?<year>`）

- ```js
  const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
  ```

- ```js
  let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
  ```

- ```js
  '2015-01-02'.replace(re, (
     matched, // 整个匹配结果 2015-01-02
     capture1, // 第一个组匹配 2015
     capture2, // 第二个组匹配 01
     capture3, // 第三个组匹配 02
     position, // 匹配开始的位置 0
     S, // 原字符串 2015-01-02
     groups // 具名组构成的一个对象 {year, month, day}
   ) => {
   let {day, month, year} = groups;
   return `${day}/${month}/${year}`;
  });
  ```

## 反向引用

- \1或\k，如果要引入某个具名组匹配，可以使用\k<组名>

- ```
  const RE_TWICE = /^(?<word>[a-z]+)!\k<word>$/;
  RE_TWICE.test('abc!abc') // true
  RE_TWICE.test('abc!ab') // false
  ```

- ```
  const RE_TWICE = /^(?<word>[a-z]+)!\1$/;
  RE_TWICE.test('abc!abc') // true
  RE_TWICE.test('abc!ab') // false
  ```

- 两种用法可以同时使用

- ```
  const RE_TWICE = /^(?<word>[a-z]+)!\k<word>!\1$/;
  RE_TWICE.test('abc!abc!abc') // true
  RE_TWICE.test('abc!abc!ab') // false
  ```

## d 修饰符：正则匹配索引

- 可以让`exec()`、`match()`的返回结果添加`indices`属性，在该属性上面可以拿到匹配的开始位置和结束位置（匹配结果部包含结束位置）

- ```js
  const text = 'zabbcdef'
  const re = /ab+(cd(ef))/d
  const result = re.exec(text)
  console.log(result.indices);// [ [1, 8], [4, 8], [6, 8] ]
  console.log(result);//['abbcdef', 'cdef', 'ef', index: 1, input: 'zabbcdef', groups: undefined, indices: Array(3)]
  ```

- 如果有具名匹配，则groups为一个对象，提供具名组匹配的开始和结束位置

## String.prototype.matchAll()

- 可以一次性取出所有匹配。不过，它返回的是一个遍历器（Iterator），而不是数组。

- 可以用`for...of`循环取出。相对于返回数组，返回遍历器的好处在于，如果匹配结果是一个很大的数组，那么遍历器比较节省资源。

- 转换数组的方法：

  - ```js
    // 转为数组的方法一
    [...string.matchAll(regex)]

    // 转为数组的方法二
    Array.from(string.matchAll(regex))
    ```

## 箭头函数

- **箭头函数没有自己的`this`对象**

- ```js
  function Timer() {
    this.s1 = 0;
    this.s2 = 0;
    // 箭头函数
    setInterval(() => this.s1++, 1000);
    // 普通函数
    setInterval(function () {
      this.s2++;
    }, 1000);
  }

  var timer = new Timer();

  setTimeout(() => console.log('s1: ', timer.s1), 3100);
  setTimeout(() => console.log('s2: ', timer.s2), 3100);
  // s1: 3
  // s2: 0
  ```

  - 前者的`this`绑定定义时所在的作用域（即`Timer`函数），后者的`this`指向运行时所在的作用域（即全局对象）。所以，3100 毫秒之后，`timer.s1`被更新了 3 次，而`timer.s2`一次都没更新。

- 箭头函数实际上可以让`this`指向固定化，绑定`this`使得它不再可变，这种特性很**有利于封装回调函数**。

  - ```js
    var handler = {
      id: '123456',

      init: function() {
        document.addEventListener('click',
          event => this.doSomething(event.type), false);
      },

      doSomething: function(type) {
        console.log('Handling ' + type  + ' for ' + this.id);
      }
    };
    ```

  - addEventListener(事件名称，执行函数，触发类型)

    - 事件名为字符串，执行函数必填
    - 触发类型为布尔类型，可空，true为事件捕获阶段执行，false为事件在冒泡阶段执行

## call()、apply()、bind()函数的用法

- 在function.call(target)中，function调用call时，function中的this会改变为指向target
- apply([thisObj,argArray])应用某一个对象的一个方法，用另一个对象替换当前对象
- bind()也是，绑定当前的this

## 数组的空位

- 数组的某一个位置没有任何值，比如`Array()`构造函数返回的数组都是空位
- `Array.from()`方法会将数组的空位，转为`undefined`，也就是说，这个方法不会忽略空位
- 扩展运算符（`...`）也会将空位转为`undefined`
- `copyWithin()`会连空位一起拷贝
- `fill()`会将空位视为正常的数组位置
- `for...of`循环也会遍历空位
- `entries()`、`keys()`、`values()`、`find()`和`findIndex()`会将空位处理成`undefined`

## 属性名表达式

- 属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串`[object Object]`

  - ```js
    const keyA = {a: 1};
    const keyB = {b: 2};

    const myObject = {
      [keyA]: 'valueA',
      [keyB]: 'valueB'
    };
    //B把A覆盖掉了
    myObject // Object {[object Object]: "valueB"}
    ```

## 属性可枚举性和遍历

- 描述对象的`enumerable`属性，称为“可枚举性”，如果该属性为`false`，就表示某些操作会忽略当前属性

- 最初目的，就是让某些属性可以规避掉`for...in`操作，不然所有内部属性和方法都会被遍历到。比如，对象原型的`toString`方法，以及数组的`length`属性，就通过“可枚举性”，从而避免被`for...in`遍历到

- 目前，有四个操作会忽略`enumerable`为`false`的属性。
  - `for...in`循环：只遍历对象自身的和继承的可枚举的属性。
  - `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
  - `JSON.stringify()`：只串行化对象自身的可枚举的属性。
  - `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象自身的可枚举的属性。

- 遍历对象属性的5种方法

  - **（1）for...in**

    `for...in`循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

    **（2）Object.keys(obj)**

    `Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

    **（3）Object.getOwnPropertyNames(obj)**

    `Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

    **（4）Object.getOwnPropertySymbols(obj)**

    `Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 Symbol 属性的键名。

    **（5）Reflect.ownKeys(obj)**

    `Reflect.ownKeys`返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

## Symbol数据类型

- 可以解决类似比如原来有一个对象，我们希望在其中添加一个**新的属性和值**，但是我们在**不确定它原来内部有什么内容的情况下，很容易造成冲突，从而覆盖掉它内部的某个属性**

- Symbol，表示独一无二的值

## super访问对象原型

- `super.foo`等同于`Object.getPrototypeOf(this).foo`（属性）或`Object.getPrototypeOf(this).foo.call(this)`（方法）

## Object.assign()首参数

- ```
  const v1 = 'abc';
  const v2 = true;
  const v3 = 10;

  const obj = Object.assign({}, v1, v2, v3);
  console.log(obj); // { "0": "a", "1": "b", "2": "c" }
  ```

- 上面代码中，`v1`、`v2`、`v3`分别是字符串、布尔值和数值，结果只有字符串合入目标对象（以字符数组的形式），数值和布尔值都会被忽略。这是因为只有字符串的包装对象，会产生可枚举属性。

- ```
  Object(true) // {[[PrimitiveValue]]: true}
  Object(10)  //  {[[PrimitiveValue]]: 10}
  Object('abc') // {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}
  ```

- 上面代码中，布尔值、数值、字符串分别转成对应的包装对象，可以看到它们的原始值都在包装对象的内部属性`[[PrimitiveValue]]`上面，这个属性是不会被`Object.assign()`拷贝的。只有字符串的包装对象，会产生可枚举的实义属性，那些属性则会被拷贝。

- Object.assign()只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（`enumerable: false`）

- 浅拷贝：如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用

- 数组拷贝：把数组视为属性名为 0、1、2... 的对象

- 取值函数：只能复制返回值，不会复制整个函数

## `Object.getOwnPropertyDescriptors()`方法，返回指定对象所有自身属性（非继承属性）的描述对象

## Object.values()只返回对象自身的可遍历属性

- ```
  const obj = Object.create({}, {p: {value: 42}});
  Object.values(obj) // []
  ```

- ```
  const obj = Object.create({}, {p:
    {
      value: 42,
      enumerable: true
    }
  });
  Object.values(obj) // [42]
  ```

## `Object.fromEntries()`方法

- 是`Object.entries()`的逆操作，用于将一个键值对数组转为对象
- 该方法的主要目的，是将键值对的数据结构还原为对象，因此特别适合将 Map 结构转为对象。

## Null判断运算符

- **||用来指定默认值**，属性的值为null或undefined、空字符串、false或0时，默认值生效

- 为了避免null或undefined以外的判断，出现了??运算符，**??只判断左侧值为null或undefined**

- 优先级问题

  - ??与||、&&有优先级问题

  - ```js
    // 报错
    lhs && middle ?? rhs
    lhs ?? middle && rhs
    lhs || middle ?? rhs
    lhs ?? middle || rhs
    ```

  - 必须要加优先级的括号

  - ```js
    (lhs && middle) ?? rhs;
    lhs && (middle ?? rhs);

    (lhs ?? middle) && rhs;
    lhs ?? (middle && rhs);

    (lhs || middle) ?? rhs;
    lhs || (middle ?? rhs);

    (lhs ?? middle) || rhs;
    lhs ?? (middle || rhs);
    ```

## 逻辑赋值运算符

- ||=   &&=   ??=

- ```js
  user.id ||= 1; // 如果user.id的值不存在，则设置为1
  ```

- &&=是满足前面那个条件才执行后面的语句

- ```js
  opts.foo ??= 'bar'; // 如果不存在foo，则设置
  ```

- ||=和??=区别在于

  - 前者是falsy 值（虚值）---`false`、`null`、`undefined`、`NaN`、`0 +0 -0`、空字符串(""、''、``)
  - 后者是nullish值（null或者undefined）


## Symbol

- ES6引入的原始数据类型，表示独一无二的值，由Symbol()函数生成（不能加new命令）

- ```js
  let s1 = Symbol('foo');
  s1 // Symbol(foo)
  s1.toString() // "Symbol(foo)"
  ```

- 也可以通过**Symbol.for()**产生，可以表示同一个值，被注册到**全局**

- ```js
  let s1 = Symbol.for('foo');
  let s2 = Symbol.for('foo');
  s1 === s2 // true
  Symbol.keyFor(s1) // "foo"，获取key值
  ```

  - 两者的区别：`Symbol.for()`与`Symbol()`这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。（登记机制）

- 如果symbol**参数是对象**，则会调用该对象的**toString**方法，转换对象为字符串

- **参数相同**的Symbol()函数的**返回值**都是**不相等**的，调用100次，就会得到100个互不相等的值

- Symbol的限制

  - 不能与其他类型的值进行运算

  - 能转换为布尔值，但不能转换为数值

  - 要获取实例值，即括号里的值，需要用到实例属性.description

    - ```
      const sym = Symbol('foo');
      sym.description // "foo"
      ```

  - `for...in`循环、`Object.getOwnPropertyNames`方法都不能获取Symbol键名，要用`Object.getOwnPropertySymbols()`方法

    - ```js
      const obj = {};
      const foo = Symbol('foo');
      obj[foo] = 'bar';
      Object.getOwnPropertySymbols(obj) // [Symbol(foo)]
      ```

- Symbol的用法

  - 用于保证属性名永远唯一

    - 写法：（一定要有方括号）

    - ```js
      let mySymbol = Symbol();

      // 第一种写法
      let a = {};
      a[mySymbol] = 'Hello!';

      // 第二种写法
      let a = {
        [mySymbol]: 'Hello!'
      };

      // 第三种写法
      // Object.defineProperty()方法，将对象的属性名指定为一个Symbol值
      let a = {};
      Object.defineProperty(a, mySymbol, { value: 'Hello!' });

      // 以上写法都得到同样结果
      a[mySymbol] // "Hello!"
      ```

    - 不能用点运算符，否则属性名不是Symbol而是字符串（如下，错误示范）

    - ```js
      const mySymbol = Symbol();
      const a = {};

      a.mySymbol = 'Hello!';
      a[mySymbol] // undefined
      a['mySymbol'] // "Hello!"
      ```

  - 用于定义一组常量，保证这组常量的值都不相等

  - 用于为对象定义一些非私有的、但又希望只用于内部的方法（具体见es6入门）

- 内置函数的用法

  - Symbol.species作用：有些类库是在基类的基础上修改的，子类使用继承的方法时，可能希望返回基类的实例，而不是子类的实例

    - ```js
      class T1 extends Promise {
      }

      class T2 extends Promise {
        static get [Symbol.species]() {
          return Promise;
        }
      }

      new T1(r => r()).then(v => v) instanceof T1 // true
      new T2(r => r()).then(v => v) instanceof T2 // false
      ```

## require()，Require.js的介绍

- 他是js脚本加载器，遵循**AMD(Asynchronous Module Definition)**规范，实现js脚本的异步加载，不阻塞页面的渲染和其后的脚本的执行，并提供了加载完成之后的执行相应回调函数的功能
- require('js文件路径')，任何时候加载的都是**同一个实例**


## Set

- set可以接收任意具有iterable接口的数据结构并去重

- ```
  const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
  items.size // 5
  ```

- 也可以去除字符串里面的重复字符

- ```
  [...new Set('ababbc')].join('')
  // "abc"
  ```

- 原理是：set内部判断两个值示符不同，使用算法“Same-value-zero equality”，它类似于精确相等运算符(===)，区别是Set认为NaN等于自身，而===认为NaN不等于自身

- 另外，两个对象总是不相等的，比如两个空对象

- ```
  let set = new Set();

  set.add({});
  set.size // 1

  set.add({});
  set.size // 2

  ```

- 遍历器生成函数就是values方法，所以可以直接用for..of遍历，也可以forEach


## 逗号运算符reduce

- 先执行运算符左侧的操作数，然后再执行右侧的操作数，最后返回最右侧操作数的值

- 以reduce为各元素的属性分组为例

- ```js
  function Group(arr = [], key) {
      //reduce(), ES6数组方法，这里初始值为一个空对象;
      // 当此对象没有对应的key(当前元素的属性area)值,
      // 此对象就添加key属性值为该对象的属性并初始化一个空数组,如果有该属性就push当前元素
      return key ?
          arr.reduce((t, v) =>
          (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t
          ), {})
          : {};
  }
  const arr = [
      { area: "a", name: "Amy", age: 27 },
      { area: "b", name: "Tom", age: 25 },
      { area: "a", name: "Anna", age: 23 },
      { area: "c", name: "Lida", age: 21 },
      { area: "a", name: "Troy", age: 19 }
      ]; // 以地区area作为分组依据
  console.log(Group(arr, "area"));
  //Object
  // a: Array(3)
  // 0: {area: 'a', name: 'Amy', age: 27}
  // 1: {area: 'a', name: 'Anna', age: 23}
  // 2: {area: 'a', name: 'Troy', age: 19}

  // b: Array(1)
  // 0: {area: 'b', name: 'Tom', age: 25}

  // c: Array(1)
  // 0: {area: 'c', name: 'Lida', age: 21}
  ```

- 再比如赋值时，var a=1 , b=2 , c=3

