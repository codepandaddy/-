// 1.
// 删数
// 有一个数组 a[N] 顺序存放 0 ~ N-1 ，要求每隔两个数删掉一个数，到末尾时循环至开头继续进行，求最后一个被删掉的数的原始下标位置。以 8 个数 (N=7) 为例 :｛ 0，1，2，3，4，5，6，7 ｝，0 -> 1 -> 2 (删除) -> 3 -> 4 -> 5 (删除) -> 6 -> 7 -> 0 (删除),如此循环直到最后一个数被删除。
// 输入例子：
// 8
// 输出例子：
// 6
// 输入例子：
// 1
// 输出例子：
// 0

const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
    // Write your code here
    while ((line = await readline())) {
        let tokens = line.split(" ");
        let origin = parseInt(tokens[0]);
        const arr = [];
        for (let i = 0; i < origin; i++) {
            arr.push(i);
        }
        while (arr[2] || arr[2] == 0) {
            const a = arr.shift();
            const b = arr.shift();
            arr.push(a,b);
            arr.shift();
        }
        console.log(arr[1]);
    }
})();
