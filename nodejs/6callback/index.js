// try {
  // 调用栈call stack-调用链条
  interview(function (e) {
    if (e instanceof Error) {
      return console.log('cry');
    }
    console.log('smile');
  })
// } catch (error) {
//   console.log('cry',error);
// }


function interview(callback) {
  // 全新的函数调用栈
  setTimeout(() => {
    if (Math.random() < 0.1) {
      callback(null, 'success')
    } else {
      // 全局错误，因为不被trycatch包裹，所以catch不到
      // throw new Error('fail')
      callback(new Error('fail'))
    }
    
  }, 500);
}


// 异步会遇到的问题：并发（同时面试两家公司）、嵌套地狱（一面二面三面）