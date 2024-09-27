class Axios {
  constructor() {
    this.intercetors = {
      request: new InterceptorsManage(),
      response: new InterceptorsManage()
    };
  }

  request(config) {
    // 拦截器和请求组装队列
    let chain = [this.sendAjax.bind(this), undefined]; // 成对出现的，失败回调暂时不处理

    // 请求拦截
    this.interceptors.request.handlers.forEach((interceptor) => {
      chain.unshift(interceptor.fullfield, interceptor.rejected);
    });

    // 响应拦截
    this.interceptors.response.handlers.forEach((interceptor) => {
      chain.push(interceptor.fullfield, interceptor.rejected);
    });

    // 执行队列，每次执行一对，并给promise赋最新的值
    let promise = Promise.resolve(config);
    while (chain.length > 0) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  }

  sendAjax(config) {
    return new Promise((resolve) => {
      const { url = '', method = 'get', data = {} } = config;
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.onload = function () {
        console.log(xhr.responseText);
        resolve(xhr.responseText);
      };
      xhr.send(data);
    });
  }
}

class InterceptorsManage {
  constructor() {
    this.handlers = [];
  }

  use(fullfield, rejected) {
    this.handlers.push({
      fullfield,
      rejected
    });
  }
}

// 定义get、post等方法挂载到Axios原型上
const methodsArr = ['get', 'delete', 'head', 'options', 'put', 'patch', 'post'];
methodsArr.forEach((met) => {
  Axios.prototype[met] = function () {
    console.log('excute method:' + met);
    // 处理单个方法
    if (['get', 'delete', 'head', 'options'].includes(met)) {
      // 2个参数(url[, config])
      return this.request({
        method: met,
        url: arguments[0],
        ...(arguments[1] || {})
      });
    }
    // 3个参数(url[,data[,config]])
    return this.request({
      method: met,
      url: arguments[0],
      data: arguments[1] || {},
      ...(arguments[2] || {})
    });
  };
});

// 将Axios.prototype上的方法搬运到request上
const utils = {
  extend(a, b, context) {
    for (const key in b) {
      if (Object.prototype.hasOwnProperty.call(b, key)) {
        a[key] = typeof b[key] === 'function' ? b[key].bind(context) : b[key];
      }
    }
  }
};

function createAxioFn() {
  let axios = new Axios();
  let req = axios.request.bind(axios); // 实现 axios({})请求方式

  utils.extend(req, Axios.prototype, axios);
  utils.extend(req, axios);
  return req;
}

let axios = createAxioFn();
