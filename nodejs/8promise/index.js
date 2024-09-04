// (function() {
//   var promise = interview();
//   promise.then((res) => {
//     console.log('s');
//   }).catch(err=>{
//     console.log('c');
//   })
//   // 回产生新的promise
//   var promise2 = interview().then(res => {
//     // return 则为解决状态
//     // throw 为reject状态
//     return 'yes'
//   })
// })();

// 解决嵌套地狱
// (function() {
//   var promise = interview()
//   .then((res) => {
//     return interview(2)
//   }).then((res) => {
//     return interview(3)
//   }).then(() => {
//     console.log('smiel');
//   })
//   .catch((err) => {
//     console.log(err);
//   })
// })();


function interview(name) {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.2) {
      resolve('su')
    } else {
      var error = new Error();
      error.name = name;
      reject(error)
    }
  })
}
// 解决并发问题
(function() {
  Promise.all([interview('geekbang'), interview('tencent')]).then(() =>{
    console.log(smile);
  }).catch(err =>{
    // 第一个失败的结果
    console.log(err.name);
  })
})();