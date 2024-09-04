const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
  let line = await readline();
  const n = line.split(' ')[0];
  line = await readline();
  const score = line.split(' ').map(n => parseInt(n));
  line = await readline();
  const k = line.split(' ')[0];
  console.log(n,score,k);
  const dp = new Array(n).fill(0);
  // 使用一个双端队列来维护单调递减的索引
  const deque = [];
  for (let i = 0; i < n; i++) {
    // 移除队列中超出步长限制的索引
    if (deque.length && i - deque[0] > k) {
      deque.shift();
    }
    // 更新当前位置的最大得分
    dp[i] = (deque.length ? dp[deque[0]] : 0) + score[i];
    // 保持单调递减性质，比当前dp[i]还小的dp[i-x]已经没有用了，要取也是取当前dp[i]或前面更大的值
    while (deque.length && dp[i] >= dp[deque.length-1]) {
      deque.pop();
    }
    deque.push(i);
  }
  console.log(dp[dp.length - 1]);
})();