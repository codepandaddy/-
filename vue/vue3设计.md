# 第一篇 框架设计概览

## 第1章 权衡的艺术

- 关于命令式和声明式两种范式的差异，一个注重过程，一个注重结果，当出现心智和性能上的需求不同时，可以选择不同的范式，前者性能好，后者心智负担小
- 虚拟dom：创建js对象+创建真实的dom
- 虚拟dom的性能是在innerHTML和原生js之间比较好的，重点是可维护性强
  - 这里有个公式，即声明式的更新性能消耗=找出差异的性能消耗+直接修改的性能消耗
  - 性能上，与页面大小、变更部分大小、创建还是更新有关系
  - innerHTML要全量更新（销毁全部），虚拟dom只更新必要的元素
  - 原生js和虚拟dom都有js方面的计算，虚拟dom有diff，但并不会产生数量级上的差异
- 纯运行时，用户直接提供数据对象；纯编译时，用户可以提供字符串，编译成数据对象；目前vue.js支持的就是运行时+编译时，更灵活

## 第2章 框架设计的核心要素

- 开发体验上，注重警告信息（控制台）的树出，更直观、快速定位
- 生产环境的体积需要控制，将dead code去除，就需要webpack移除，使这类代码不会出现在生产环境里面
- Tree-shaking用pure注释辅助，对用户用不到的功能进行排除
- 框架设计中的特性开关，满足用户仅需的功能
- 错误处理接口，不用太多的try-catch


## 第3章 vue.js3的设计思路

- 整个vue组件其实都是基于最基本的渲染器实现的，递归遍历虚拟的dom对象，来还原真实dom对象，渲染组件的就叫subtree


# 第二篇 响应系统

## 第4章 响应系统的作用与实现

### 微型的响应系统

- ```js
  // 存储副作用函数的桶
  const bucket = new Set();
  const data = {text: 'hello world'};
  // 原始数据的代理对象
  const obj = new Proxy(data, {
    // 拦截读取
    get(target, key) {
      bucket.add(effect);
      return target[key];
    },
    // 拦截设置
    set(target, key, newVal) {
      target[key] = newVal;
      bucket.forEach(fn => fn());
      return true;
    }
  });
  //副作用的函数
  function effect() {
    document.body.innerText = obj.text;
  }
  effect();
  setTimeout(() => {
    obj.text = 'hello vue3';
  }, 1000);
  ```

- 还不能实现注册匿名函数

### 拓展知识：Proxy替代Object.defineProperty实现数据响应

- Proxy：通过自定义set 和get 函数的方式，在原本的逻辑中实现自己的函数逻辑，在对对象任何属性进行读写时发出通知
- 区别：Proxy无需一层层递归为每个属性添加代理；原先的API实现需要递归监听和赋值，且需要多种api辅助

### 注册匿名

- ```js
  const obj = new Proxy(data, {
    // 拦截读取
    get(target, key) {
      if (activeEffect) { // 新增
        bucket.add(activeEffect);
      }
      return target[key];
    },
    // 拦截设置
    set(target, key, newVal) {
      target[key] = newVal;
      bucket.forEach(fn => fn());
      return true;
    }
  });
  let activeEffect; // 函数
  function effect(fn) {
    activeEffect = fn;
  }
  // 匿名函数
  effect(() => {
    console.log('effect fun'); // 打印两次
    document.body.innerText = obj.text;
  });
  setTimeout(() => {
    obj.notExist = 'hello vue3'; // 不存在的属性
  }, 1000);
  ```

- 出现问题--赋值不存在的属性却都走了effect

- 原因--没有在副作用函数与被操作的目标字段之间建立明确的关系

### 建立明确联系

- ```js
  // 存储副作用函数的桶，即target-->Map
  const bucket = new WeakMap();
  const data = {text: 'hello world'};
  // 原始数据的代理对象
  const obj = new Proxy(data, {
    // 拦截读取
    get(target, key) {
      if (!activeEffect) {
        return target[key];
      }
      // 根据target从桶中获取depsMap，它也是一个Map，即 key->Set (effects)构成
      let depsMap = bucket.get(target);
      if (!depsMap) {
        bucket.set(target, (depsMap = new Map()));
      }
      // 再根据key从depsMap中取得deps，它是一个set类型
      // 里面存了所有与当前key相关的副作用函数:effects
      let deps = depsMap.get(key);
      if (!deps) {
        depsMap.set(key, (deps = new Set()));
      }
      // 将当前激活的副作用函数添加到桶里
      deps.add(activeEffect);
      // 返回属性值
      return target[key];
    },
    // 拦截设置
    set(target, key, newVal) {
      target[key] = newVal;
      const depsMap = bucket.get(target);
      if (!depsMap) return;
      // 根据key取得所有副作用函数 effects
      const effects = depsMap.get(key);
      // 执行副作用函数
      effects && effects.forEach(fn => fn());
      return true;
    }
  });
  ```

- 关系如下

- ![3](D:\部门培训\3个月学习笔记\3.png)

  - 这种Set数据结构所存储的副作用函数集合称为key的依赖集合



### 拓展知识：WeakMap和Map的区别

- ```js
  // 代码解释
  const map = new Map();
  const weakmap = new WeakMap();

  // 立即执行的函数表达式(IIFE: immediately invoked function expression)
  (function() {
    const foo = {foo:1};
    const bar = {bar:2};
    map.set(foo, 1);
    weakmap.set(bar,2);
  })()
  ```

- 执行后

  - foo作为map的key依然被引用，一直存在，因此垃圾回收机制GC不会把它从内存中删除，依然可以通过map.keys()打印出foo对象
  - bar作为weakmap的key来说是弱引用，它不会被GC影响，所以表达式结束后，GC就会将bar从内存中删除，无法再从weakmap获取key值，也无法获取到bar

- WeakMap的作用

  - 经常用于存储那些，只有当key**所引用的对象存在**时才有价值的信息
  - 比如上方target对象没有任何引用了，用户侧不再需要，则可以回收；但如果用Map，则最终会导致内存溢出

### 封装处理

- 上面的实现是在get拦截函数中编写把副作用函数收集到桶里的这部分逻辑，但更好的做法是，将这部分逻辑单独封装到一个track函数中，即追踪；可以把触发副作用函数重新执行的逻辑封装到trigger函数中

- ```js
  const obj = new Proxy(data, {
    get(target, key) {
      // 将副作用函数activeEffect添加到存储副作用函数的桶中
      track(target, key);
      // 返回属性值
      return target[key];
    },
    set(target, key, newVal) {
      // 设置属性值
      target[key] = newVal;
      // 把副作用函数从桶中取出并执行
      trigger(target, key);
    }
  });
  // 在get拦截函数中调用track函数追踪变化
  function track(target, key) {
    if (!activeEffect) return;
    let depsMap = bucket.get(target);
    if (!depsMap) {
      bucket.set(key, depsMap = new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, deps = new Set());
    }
    deps.add(activeEffect);
  }
  // 在set拦截函数内调用trigger函数触发变化
  function trigger(target, key) {
    const depsMap = bucket.get(target);
    if (!depsMap) return;
    const effects = depsMap.get(key);
    effects && effects.forEach(fn => fn());
  }
  ```

### 分支切换与cleanup

- ```js
  effect(function effectFn() {
    document.body.innerText = obj.ok?obj.text ? 'not';
  })
  ```

- 分支切换：变化obj.ok的值，代码的分支也会发生变化

- 分支切换可能会产生遗留的副作用函数，就是说，effectFn执行时会读取这两个字段，并分别被字段ok和text所对应的依赖集合收集

  - 现象：当obj.ok的值修改为false，并触发副作用函数effectFn重新执行后，由于此时字段obj.text不会被读取，只会触发字段obj.ok的读取；修改text的值，则会导致副作用函数重新执行，即使document.body.innerText不需要变化
  - 解决思路：**每次副作用函数执行前，将它从所有与之相关的依赖集合中删除**

-  ```js
  function track(target, key) {
    if (!activeEffect) return;
    let depsMap = bucket.get(target);
    if (!depsMap) {
      bucket.set(key, depsMap = new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, deps = new Set());
    }
    // 将当前激活的副作用函数添加到依赖集合中
    deps.add(activeEffect);
    // deps就是一个与当前副作用函数存在联系的依赖集合
    // 将其添加到副作用函数的activeEffect.deps数组中
    activeEffect.deps.push(deps);
  }
  ```

- 以上完成依赖的收集，于是在执行之前，根据effects.deps可以获取所有与之相关的依赖，并从依赖集合中移除

- ```js
  function trigger(target, key) {
    const depsMap = bucket.get(target);
    if (!depsMap) return;
    const effects = depsMap.get(key);
    effects && effects.forEach(fn => fn());
  }
  let activeEffect;
  function effect(fn) {
    const effectFn = () => {
      // 调用cleanup函数完成清除工作
      cleanup(effectFn);
      activeEffect = effectFn;
      fn();
    };
    effectFn.deps = [];
    effectFn();
  }
  function cleanup(effectFn) {
    // 遍历effectFn.deps数组
    for (const i in effectFn.deps) {
      const deps = effectFn.deps[i];
      // delete函数不会修改数组的长度
      // 将effectFn从依赖集合中移除
      deps.delete(effectFn);
    }
    // 最后要重置effectFn.deps数组
    effectFn.deps.length = 0;
  }
  ```

### 拓展知识：Set.prototype.forEach规范

- 但此时因为trigger的最后一行代码effects && effects.forEach(fn => fn())导致无限循环

- 原因如下

  - ```js
    const set = new Set([1]);
    set.forEach(item => {
      set.delete(1);
      set.add(1);
      log('循环中'); // 一直打印
    })
    ```


- forEach遍历Set集合时，当值被删除后又添加后，如果此时forEach还未结束，该值会被重新访问，因此上面的代码将会无限执行

- 解决如下

- ```js
  const set = new Set([1]);
  const newSet = new Set(set);
  newSet.forEach(item => {
    set.delete(1);
    set.add(1);
    log('循环中'); // 只打印一次
  })
  ```

- 上面新构造一个newSet，则不会再循环遍历set自身

### 分支切换与cleanup——改造trigger

- ```js
  function trigger(target, key) {
    const depsMap = bucket.get(target);
    if (!depsMap) return;
    const effects = depsMap.get(key);
    // 改造如下
    const effectsToRun = new Set(effects);
    effectsToRun.forEach(effectFn => effectFn());
  }
  ```

### 嵌套的effect与effect栈

- 嵌套的场景：

  - ```js
    const Foo = {
      render() {
        return /*..*/;
      }
    }
    // bar组件中渲染了foo
    const Bar = {
      render() {
        return <Foo />; // jsx语法
      }
    }
    // 上述代码相当于
    effect(() => {
      Bar.render();
      // 嵌套
      effect(() => {
      	Foo.render();
      })
    })
    ```

- 现在的系统并不支持嵌套

  - ```js
    const data = {foo: true, bar: true};
    const obj = new Proxy(data, {/*...*/});
    let temp1, temp2;
    // fn1嵌套fn2
    effect(function effectFn1() {
      console.log('fn1执行');
      effect(function effectFn2() {
        console.log('fn2执行');
        // 在fn2中读取bar
        temp2 = obj.bar;
      });
      // 在fn1中读取foo
      temp1 = obj.foo;
    });
    ```

- 现象：执行结果为![4](D:\1deptTrain\manifestOfThreeMonth\4.png)

  - 如果修改foo的值，fn1没有重复执行，反而fn2执行了

  - 问题出在实现的effect函数与activeEffect上

  - ```js
    let activeEffect;
    function effect(fn) {
      const effectFn = () => {
        cleanup(effectFn);
        // 当调用effect注册副作用函数时，将副作用函数赋值给了activeEffect
        // 也就是说，当副作用函数发生嵌套时，永远都会覆盖上一个activeEffect，并且永远不会恢复到原来的值，依赖收集永远是内层副作用函数
        activeEffect = effectFn;
        fn();
      };
      effectFn.deps = [];
      effectFn();
    }
    ```

- 解决方案：副作用函数栈effectStack，在执行时，先把副作用函数压入栈中，待副作用函数执行完后再从栈中弹出，并始终让activeEffect指向栈顶的副作用函数

  - ```js
    let activeEffect;
    const effectStack = [];
    function effect(fn) {
      const effectFn = () => {
        // 调用cleanup函数完成清除工作
        cleanup(effectFn);
        // 当调用effect注册副作用函数时，将副作用函数赋值给了activeEffect
        // 也就是说，当副作用函数发生嵌套时，永远都会覆盖上一个activeEffect，并且永远不会恢复到原来的值，依赖收集永远是内层副作用函数
        activeEffect = effectFn;
        // 在调用副作用函数之前先将当前副作用函数压入栈中
        effectStack.push(activeEffect);
        fn();
        // 执行后弹出栈，并把activeEffect还原为之前的值
        activeEffect = effectStack[effectStack.length - 1];
      };
      // activeEffect.deps用来存储所有的与该副作用函数相关的依赖集合
      effectFn.deps = [];
      // 执行副作用函数
      effectFn();
    }
    ```

- 效果：响应式数据只会收集直接读取其值的副作用函数作为依赖，从而避免错乱

- ![5](D:\1deptTrain\manifestOfThreeMonth\5.png)

### 避免无限递归循环

- ```js
  effect(() => {
    obj.foo++;
  });
  // 报错：RangeError: Maximum call stack size exceeded 栈溢出
  ```

- 问题：因为在这个表达式中，既会读取obj.foo，又会设置它的值——先读取obj.foo，触发track，将当前副作用函数收集到桶里，然后+1后，再赋值给obj.foo，触发trigger，即把桶里的副作用函数取出并执行

  - 副作用函数还在执行，却要开始下一次执行，就会无限递归调用自己

- 解决方案：track和trigger执行的副作用函数都是activeEffect，那么就可以再trigger中添加守卫条件——**如果trigger触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行**

  - ```js
    function trigger(target, key) {
      const depsMap = bucket.get(target);
      if (!depsMap) return;
      const effects = depsMap.get(key);
      const effectsToRun = new Set();
      effects && effects.forEach(effectFn => {
        // 相同则不触发
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
      effectsToRun.forEach(effectFn => effectFn());
    }
    ```

  - 从而避免栈溢出

### 调度执行--控制执行顺序

- 可调度：指的是当trigger动作触发副作用函数重新执行的时候，有能力决定副作用函数执行的时机、次数以及方式

- ```js
  const data = {foo: 1};
  //此处省略obj代理对象
  effect(() => {
    console.log(obj.foo);
  });
  obj.foo++;
  console.log('结束了');
  ```

- 打印结果：![6](D:\1deptTrain\manifestOfThreeMonth\6.png)

- 假设需求有变，要求返回顺序为：1 ‘结束了’ 2

  - 在**不改变代码顺序**的基础上实现需求

- 实现如下

  - 1、trigger中判断调度器是否存在

  - ```js
    // 在set拦截函数内调用trigger函数触发变化
    function trigger(target, key) {
      const depsMap = bucket.get(target);
      if (!depsMap) return;
      const effects = depsMap.get(key);
      const effectsToRun = new Set();
      effects &&
        effects.forEach((effectFn) => {
        // 相同则不触发
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
      effectsToRun.forEach((effectFn) => {
        // 新增
        // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
        if (effectFn.options.scheduler) {
          effectFn.options.scheduler(effectFn);
          return;
        }
        // 否则直接执行副作用函数
        effectFn();
      });
    }
    ```

  - 2、在effect中，挂载对应选项属性到副作用函数上

  - ```js
    function effect(fn, options = {}) {
      const effectFn = () => {
        // 调用cleanup函数完成清除工作
        cleanup(effectFn);
        // 当调用effect注册副作用函数时，将副作用函数赋值给了activeEffect
        // 也就是说，当副作用函数发生嵌套时，永远都会覆盖上一个activeEffect，并且永远不会恢复                                                                                                    到原来的值，依赖收集永远是内层副作用函数
        activeEffect = effectFn;
        // 在调用副作用函数之前先将当前副作用函数压入栈中
        effectStack.push(activeEffect);
        fn();
        // 执行后弹出栈，并把activeEffect还原为之前的值
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      };
      // 把选项参数options挂载到effectFn上 新增
      effectFn.options = options;
      // activeEffect.deps用来存储所有的与该副作用函数相关的依赖集合
      effectFn.deps = [];
      // 执行副作用函数
      effectFn();
    }
    ```

  - 3、在副作用函数中定义调度器，将副作用函数放到宏任务中执行

  - ```js
    effect(
      () => {
        console.log(obj.foo);
      },
      // options
      {
        // 调度器函数
        scheduler(fn) {
          // 把副作用函数放到宏任务队列中执行
          setTimeout(fn);
        }
      }
    );
    ```

- 结果：![7](D:\1deptTrain\manifestOfThreeMonth\7.png)

### 拓展知识：宏任务队列

- 宏任务有Event Table、Event Queue，微任务有Event Queue

- ```
  1.宏任务：包括整体代码script，setTimeout，setInterval、I/O、UI 交互事件、setImmediate(Node.js 环境)；
  2.微任务：Promise、MutaionObserver、process.nextTick(Node.js 环境)

  注：new Promise中的代码会立即执行，then函数分发到微任务队列，process.nextTick分发到微任务队列Event Queue

  ```

- 例子1：简单介绍

- ```js
  setTimeout(function() {
      console.log('宏任务setTimeout');  //先遇到setTimeout，将其回调函数注册后分发到宏任务Event Queue
    //如果setTimeout设置时间，那它会先把函数放到宏任务Event Table,等时间到了再放入宏任务Event Queue里面
  })
  new Promise(function(resolve) {
      console.log('微任务promise');  	//new Promise函数立即执行
      resolve();						//必须resolve执行才能执行then
  }).then(function() {
      console.log('微任务then');  		  //then函数分发到微任务Event Queue
  })
  console.log('主线程console');
  // 执行顺序结果： 微任务promise –> 主线程console –> 微任务then –> 宏任务setTimeout
  ```

- 例子2：复杂代码

- ```js
  console.log('1主线程');					//整体script作为第一个宏任务进入主线程
  setTimeout(function() {				//setTimeout，其回调函数被分发到宏任务Event Queue（执行规则：从上到下排序，先进先执行）中
      console.log('2宏任务');
      process.nextTick(function() {
          console.log('3宏任务里面的微任务');
      })
      new Promise(function(resolve) {
          console.log('4微任务');
          resolve();
      }).then(function() {
          console.log('5微任务')
      })
  })
  process.nextTick(function() {	//process.nextTick()其回调函数被分发到微任务Event Queue中
      console.log('6微任务');
  })
  new Promise(function(resolve) {		//Promise，new Promise直接执行，输出7
      console.log('7微任务');
      resolve();
  }).then(function() {
      console.log('8微任务')			//then被分发到微任务Event Queue中,排在process.nextTick微任务后面。
  })
  setTimeout(function() {			//setTimeout，其回调函数被分发到宏任务Event Queue中,排在前面的setTimeout后面
      console.log('9宏任务');
      process.nextTick(function() {
          console.log('10宏任务里面的微任务');
      })
      new Promise(function(resolve) {
          console.log('11微任务');
          resolve();
      }).then(function() {
          console.log('12微任务')
      })
  })
  //执行结果： 1主线程 –> 7微任务 –> 6微任务 –> 8微任务 –> 2宏任务 –> 4微任务 –> 3宏任务里面的微任务 –> 5微任务 –> 9宏任务 –> 11微任务 –> 10宏任务里面的微任务 –> 12微任务
  ```

- 例子3：异步

- ```js
  async function async1() {
      console.log('async1 start')
      await async2()
      console.log('async1 end')
  }
  async function async2() {
      console.log('async2')
  }
  async1()
  console.log('script end')
  ```

- async函数还是基于Promise的一些封装，而Promise是属于微任务的一种；因此会把await async2()后面的所有代码放到Promise的then回调函数中去，相当于下面代码写法：

- ```js
  async function async1() {
      console.log('async1 start')
      new Promise(function(resolve){
          console.log('async2')
          resolve()
      }).then(function(){
          console.log('async1 end')
      })
  }
  async1()
  console.log('script end')
  // 执行顺序是：async1 start –> async2 –> script end –> async1 end
  ```

- 总结：![8](D:\1deptTrain\manifestOfThreeMonth\8.png)

### 调度执行--控制执行次数

- ```js
  obj.foo++;
  obj.foo++;
  ```

- 会打印出 1 2 3

- 需求：只关心结果，不包括过滤状态，即打印 1 3

- ```js
  // 定义一个任务队列，自动去重功能
  const jobQueue = new Set();
  // 使用Promise.resolve()实现一个promise实例，用它将一个任务添加到任务队列
  const p = Promise.resolve();

  // 标志是否正在刷新队列
  let isFlushing = false;
  function flushJob() {
    // 如果队列正在刷新，则什么都不做
    if (isFlushing) {
      return;
    }
    isFlushing = true;
    // 在微任务队列中刷新 jobQueue 队列
    p.then(() => {
      jobQueue.forEach(job => job());
    }).finally(() => {
      // 结束时重置
      isFlushing = false;
    });
  }
  effect(
    () => {
      console.log(obj.foo);
    },
    // options
    {
      // 调度器函数
      scheduler(fn) {
        // 每次调度的时候，将副作用函数添加到 jobQueue 中
        jobQueue.add(fn);
        // 刷新队列
        flushJob();
      }
    }
  );
  obj.foo++;
  obj.foo++;
  ```

- 效果：连续对obj.foo执行两次，则同步且连续对scheduler执行两次，也就是jobQueue.add调用两次，但由于set去重，jobQueue中只有一项，即当前的副作用函数；类似的，flushJob也会同步且连续地执行两次，但由于isFlushing存在，实际上flushJob函数一旦开始，isFlushing就一直是true，即在一个事件循环中只会执行一次，并且当它执行的时候，obj.foo已经是3了

- 理解p：将所有其他实现的Promise对象封装成一个当前实现的Promise对象，flushJob内通过p.then将一个函数添加到微任务队列中，在微任务队列中完成对jobQueue的遍历执行

### 计算属性computed和lazy

- 需求：希望需要它的时候再执行

- 实现：

  - ```js
    const data = { foo: 1, bar: 2 };
    function effect(fn, options = {}) {
      const effectFn = () => {
        // 调用cleanup函数完成清除工作
        cleanup(effectFn);
        // 当调用effect注册副作用函数时，将副作用函数赋值给了activeEffect
        // 也就是说，当副作用函数发生嵌套时，永远都会覆盖上一个activeEffect，并且永远不会恢复                                                                                                    到原来的值，依赖收集永远是内层副作用函数
        activeEffect = effectFn;
        // 在调用副作用函数之前先将当前副作用函数压入栈中
        effectStack.push(activeEffect);
        // 把fn的执行结果存储到res中
        const res = fn(); // 新增
        // 执行后弹出栈，并把activeEffect还原为之前的值
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
        // 将res作为effectFn的返回值
        return res; // 新增
      };
      // 把选项参数options挂载到effectFn上，
      effectFn.options = options;
      // activeEffect.deps用来存储所有的与该副作用函数相关的依赖集合
      effectFn.deps = [];
      // 只有非lazy时才执行 新增
      if (!options.lazy) {
        effectFn();
      }
      return effectFn;
    }
    function computed(getter) {
      // 把getter作为副作用函数，创建一个lazy的effect
      const effectFn = effect(getter, {
        lazy: true
      });
      const obj1 = {
        // 当读取value时才执行effectFn
        get value() {
          return effectFn();
        }
      };
      return obj1;
    }

    const sumRes = computed(() => obj.foo + obj.bar);

    console.log(sumRes.value); // 3
    ```

  - 以上只是对计算属性实现了懒计算，但没有做到对值的缓存

- 需求：缓存

  - ````js
    function computed(getter) {
      // value 用来缓存上一次计算的值
      let value;
      // dirty 标志，用来标识是否需要重新计算值，为true即意味着需要重新计算
      let dirty = true;

      // 把getter作为副作用函数，创建一个lazy的effect
      const effectFn = effect(getter, {
        lazy: true,
        // 添加调度器，将dirty重置为true
        scheduler() {
          if (!dirty) {
            dirty = true;
            // 当计算属性依赖的响应式数据变化时，手动调用trigger函数触发响应
            // 因为如果另一个effect函数中log计算属性的value值，在宏任务中修改属性值，不会触发计算函数内部的const effect来修改属性值
            trigger(obj, 'value');
          }
        }
      });

      const obj1 = {
        // 当读取value时才执行effectFn
        get value() {
          if (dirty) {
            value = effectFn();
            dirty = false;
          }
          // 当读取value值时，手动调用track函数进行追踪
          track(obj, 'value');
          return value;
        }
      };
      return obj1;
    }

    const sumRes = computed(() => obj.foo + obj.bar);

    effect(function effectFn() {
      console.log(sumRes.value);
    });
    ````

  - value用来缓存上一次的值，dirty判断是否重新计算

  - 调度器scheduler可以在响应式数据变化时，将dirty重置为true，则下次访问value时就会重新调用effectFn计算值


  - 解决computed中effect嵌套问题：当读取一个value属性时，手动调用track函数，把计算属性返回的对象obj1作为target，同时作为第一个参数传递给track函数；当计算属性所依赖的响应式数据变化时，会执行调度器函数，在调度器函数内手动调用trigger函数触发响应即可

### watch的实现原理

- watch本质就是观测一个响应式数据变化，就是利用了effect中的scheduler调度器选项


- ```js
  // watch接收两个参数，source是响应式数据，cb是回调函数
  function watch(source, cb) {
    effect(
      // 触发读取操作，从而建立联系
      () => source.foo,
      {
        scheduler() {
          // 当数据变化时，调用回调函数cb
          cb();
        }
      }
    );
  }
  watch(obj, () => {
    console.log('data changed');
  });
  obj.foo++;
  ```

- 现在只是硬编码了对source.foo的读取操作

- 需求：封装一个通用的读取操作

  - ```js
    // watch接收两个参数，source是响应式数据，cb是回调函数
    function watch(source, cb) {
      effect(
        // 调用traverse递归地读取
        () => traverse(source),
        {
          scheduler() {
            // 当数据变化时，调用回调函数cb
            cb();
          }
        }
      );
    }
    function traverse(value, seen = new Set()) {
      // 如果要读取的数据是原始值，或者已经被读取过了，那么什么都不做
      if (typeof value !== 'object' || value === null || seen.has(value)) return;
      // 将数据添加到seen中，代表遍历地读取过了，避免循环引用引起的死循环
      seen.add(value);
      // 暂时不考虑数组等其他结构
      // 假设value就是一个对象，使用for..in读取对象的每一个值，并递归地调用traverse进行处理
      for (const k in value) {
        traverse(value[k], seen);
      }
      return value;
    }
    ```

- 需求：用户可指定该watch依赖哪些响应式数据，只有这些数据变化时才触发回调函数

  - ```js
    // watch接收两个参数，source是响应式数据，cb是回调函数
    function watch(source, cb) {
      // 定义getter
      let getter;
      // 用户传递的是getter函数
      if (typeof source === 'function') {
        getter = source;
      } else {
        getter = () => traverse(source);
      }
      // 定义新旧值
      let newVal, oldVal;
      // 使用effect注册副作用函数时，开启lazy选项，并把返回值存储到effectFn中以便后续手动调用
      const effectFn = effect(
        // 调用traverse递归地读取
        () => getter(),
        {
          lazy: true, // 核心
          scheduler() {
            // 在scheduler中重新执行副作用函数，获取新值
            newVal = effectFn();
            // 将新旧值传递给回调函数
            cb(newVal, oldVal);
            // 更新旧值，不然下次会得到错误的旧值
            oldVal = newVal;
          }
        }
      );
      // 手动调用副作用函数，拿到的就是旧值
      oldVal = effectFn();
    }
    watch(
      () => obj.foo,
      (newVal, oldVal) => {
        console.log(newVal, oldVal); // 2 1
      }
    );
    obj.foo++;
    ```

  - 最核心的改动是lazy，创建一个懒执行的effect

  - watch最下方，通过手动调用effectFn获取初始值oldVal，当发生变化时触发scheduler重新effectFn获取新值，作为参数传递给cb回调

  - 最后最重要的事情是，不要忘记更新旧值oldVal = newVal，否则下次变更会得到错误的旧值

### 立即执行的watch与回调执行时机

- ```js
  function watch(source, cb, options = {}) {
    // 定义getter
    let getter;
    // 用户传递的是getter函数
    if (typeof source === 'function') {
      getter = source;
    } else {
      getter = () => traverse(source);
    }
    // 定义新旧值
    let newVal, oldVal;

    // 提取scheduler函数为一个独立的job函数
    const job = () => {
      newVal = effectFn();
      cb(newVal, oldVal);
      oldVal = newVal;
    };

    // 使用effect注册副作用函数时，开启lazy选项，并把返回值存储到effectFn中以便后续手动调用
    const effectFn = effect(
      // 调用traverse递归地读取
      () => getter(),
      {
        lazy: true,
        // job作为调度器函数
        scheduler: job
      }
    );
    if (options.immediate) {
      // 当immediate为true时，立即执行job，从而触发回调执行
      job();
      return;
    }
    // 手动调用副作用函数，拿到的就是旧值
    oldVal = effectFn();
  }
  watch(
    () => obj.foo,
    (newVal, oldVal) => {
      console.log(newVal, oldVal);
    },
    {
      // cb会在watch创建时立即执行一次
      immediate: true
    }
  );
  ```

- 除此之外，也可以用vue.js3的flush实现执行时机

- ```js
  function watch(source, cb, options = {}) {
    // 定义getter
    let getter;
    // 用户传递的是getter函数
    if (typeof source === 'function') {
      getter = source;
    } else {
      getter = () => traverse(source);
    }
    // 定义新旧值
    let newVal, oldVal;

    // 提取scheduler函数为一个独立的job函数
    const job = () => {
      newVal = effectFn();
      cb(newVal, oldVal);
      oldVal = newVal;
    };

    // 使用effect注册副作用函数时，开启lazy选项，并把返回值存储到effectFn中以便后续手动调用
    const effectFn = effect(
      // 调用traverse递归地读取
      () => getter(),
      {
        lazy: true,
        // job作为调度器函数
        scheduler: () => {
          // 在调度函数中判断 flush 是否为 ‘post’，如果是，将其放到微任务队列中执行
          if (options.flush === 'post') {
            const p = Promise.resolve();
            p.then(job);
          } else {
            job();
          }
        }
      }
    );
    if (options.immediate) {
      // 当immediate为true时，立即执行job，从而触发回调执行
      job();
      return;
    }
    // 手动调用副作用函数，拿到的就是旧值
    oldVal = effectFn();
  }
  watch(
    () => obj.foo,
    (newVal, oldVal) => {
      console.log(newVal, oldVal);
    },
    {
      // cb会在watch创建时立即执行一次
      // immediate: true
      flush: 'pre' // pre/post/sync
    }
  );
  ```

  - 改变了scheduler的实现方式，在调度器中检测options.flush的值是否为post，如果是，则将job函数放到微任务队列中，从而实现异步延迟执行；否则直接执行job函数，本质上相当于‘sync’的实现机制，即同步执行
  - pre是组件更新前；post是组件更新后

### 过期的副作用

- 竞态问题：又叫**竞态条件**、**竞争条件**（**race condition**）。它旨在描述一个系统或者进程的输出依赖于不受控制的事件出现顺序或者出现时机。此词源自于两个信号试着彼此竞争，来影响谁先输出

  -  对于前端来说最常见的竞态问题一般发生在异步请求时

  - ```js
    let finalData
    watch(obj, async() => {
      // 发送并等待网络请求
      const res = await fetch('/path/to/request')
      // 将请求结果赋值给data
      finalData = res
    })
    ```

  - 代码中，用watch观测obj对象的变化，每次obj对象发生变化时都会发送网络请求，等请求结束后将结果赋值给finalData

  - 如果在该请求A返回结果前，再发送B请求，则会导致不确定谁的结果赋值给finalData，按理来说B应该时最新的

- 解决：应该将B请求设置为“最新的”，而A请求为“过期的“，即设计一个让副作用过期的手段

- ```js
  function watch(source, cb, options = {}) {
    let getter;
    if (typeof source === 'function') {
      getter = source;
    } else {
      getter = () => traverse(source);
    }
    let newVal, oldVal;

    // 用来存储用户注册的过期回调
    let cleanup1;
    // 定义onInvalidate函数
    function onInvalidate(fn) {
      // 将过期回到存储到cleanup中
      cleanup1 = fn;
    }
    const job = () => {
      newVal = effectFn();
      // 在调用回调函数cb前，先调用过期回调
      if (cleanup1) {
        cleanup1();
      }
      // 作为第三个参数，便于用户使用
      cb(newVal, oldVal, onInvalidate);
      oldVal = newVal;
    };

    const effectFn = effect(
      () => getter(),
      {
        lazy: true,
        scheduler: () => {
          if (options.flush === 'post') {
            const p = Promise.resolve();
            p.then(job);
          } else {
            job();
          }
        }
      }
    );
    if (options.immediate) {
      job();
      return;
    }
    oldVal = effectFn();
  }
  ```

  - 定义cleanup变量，用来存储用户通过onInvalidate函数注册过的过期回调
  - 只是把过期回调赋值给了cleanup，关键是在job中，每次执行cb之前，先检查是否存在过期回调，存在则执行cleanup，最后把onInvalidate函数作为回调函数的第三个参数传递给cb，以便用户使用

- 举例

- ```js
  watch(obj, async (newVal, oldVal, onInvalidate) => {
    let expired = false;
    onInvalidate(() => {
      expired = true;
    })
    const res = await fetch('path/to/request')
    if (!expired) {
      finalData = res
    }
  })
  // 第一次修改
  obj.foo++;
  setTimeout(() => {
    // 200ms 后做第二次修改
    obj.foo++
  }, 200)
  ```

  - 假设请求A要1000ms后才返回结果，而第二次修改发生在200ms
  - 由于第一次执行watch的回调时，已经注册一个过期回调，所以二次执行之前，会先执行之前注册的过期回调——第一次执行的副作用函数内闭包的变量expired的值变为true，即副作用函数的执行过期了
  - ![9](D:\1deptTrain\manifestOfThreeMonth\9.jpg)