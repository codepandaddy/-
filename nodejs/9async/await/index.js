// const result = async function() {
//   try {
//     // await可以将异步回调里的error捕捉，而一般异步回调无法捕捉
//     var content = await new Promise((resolve, reject) => {
//       setTimeout(() => {
//         reject(new Error('46'))
//       }, 500);
//     })
//   } catch (error) {
//     console.log(error.message, 'err');
//   }
  
//   console.log(content);
//   return 4;
// }();
// setTimeout(() => {
//   console.log(result);
// }, 800);

// promise的语法糖
(async function () {
  try {
    // 同步获取Promise的结果
    await Promise.all([interview(1),interview(2)])
  } catch (e) {
    return console.log('cry at ' + e.name);
  }
  console.log('smile');
})()

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
// (function() {
//   Promise.all([interview('geekbang'), interview('tencent')]).then(() =>{
//     console.log(smile);
//   }).catch(err =>{
//     // 第一个失败的结果
//     console.log(err.name);
//   })
// })();

