// 2.
// 明明的随机数
// 明明生成了NN个1到500之间的随机整数。请你删去其中重复的数字，即相同的数字只保留一个，把其余相同的数去掉，然后再把这些数从小到大排序，按照排好的顺序输出。

// 数据范围： 1 \le n \le 1000 \1≤n≤1000  ，输入的数字大小满足 1 \le val \le 500 \1≤val≤500 

// 输入例子：
// 3
// 2
// 2
// 1
// 输出例子：
// 1
// 2
// 例子说明：
// 输入解释：
// 第一个数字是3，也即这个小样例的N=3，说明用计算机生成了3个1到500之间的随机整数，接下来每行一个随机数字，共3行，也即这3个随机数字为：
// 2
// 2
// 1
// 所以样例的输出为：
// 1
// 2       

const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void async function () {
    // Write your code here
    let count;
    const s = new Set();
    let arr;
    while(line = await readline()){
        let tokens = line.split(' ');
        let num = parseInt(tokens[0]);
        if (!count) {
            count = num;
            arr = new Array(count);
            continue;
        }
        if (s.has(num)) {
            continue;
        }
        s.add(num);
        arr.push(num);
    }
    arr.sort((a,b)=>a-b);
    for(let i of arr) {
        i && console.log(i);
    }
}()
