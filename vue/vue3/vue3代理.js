// 存储副作用函数的桶，即target-->Map
const bucket = new WeakMap();
const data = { text: "hello world" };
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
let activeEffect;
function effect(fn) {
  activeEffect = fn;
}
effect(() => {
  console.log("effect fun"); // 打印两次
  document.body.innerText = obj.text;
});
setTimeout(() => {
  obj.notExist = "hello vue3"; // 不存在的属性
}, 1000);