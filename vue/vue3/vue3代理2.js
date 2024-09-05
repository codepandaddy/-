// 存储副作用函数的桶，即target-->Map
const bucket = new WeakMap();
const data = { foo: 1, bar: 2 };
let activeEffect;

// 原始数据的代理对象
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
    return true;
  }
});

// 在get拦截函数中调用track函数追踪变化
function track(target, key) {
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 将当前激活的副作用函数添加到依赖集合中
  deps.add(activeEffect);
  // deps就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到副作用函数的activeEffect.deps数组中
  activeEffect.deps.push(deps);
}

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
    // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
      return;
    }
    // 否则直接执行副作用函数
    effectFn();
  });
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

const effectStack = [];
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
  // 只有非lazy时才执行
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

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

function traverse(value, seen = new Set()) {
  // 如果要读取的数据是原始值，或者已经被读取过了，那么什么都不做
  if (typeof value !== 'object' || value === null || seen.has(value))
    return;
  // 将数据添加到seen中，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value);
  // 暂时不考虑数组等其他结构
  // 假设value就是一个对象，使用for..in读取对象的每一个值，并递归地调用traverse进行处理
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
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
obj.foo++;

// const sumRes = computed(() => obj.foo + obj.bar);

// effect(function effectFn() {
//   console.log(sumRes.value);
// });