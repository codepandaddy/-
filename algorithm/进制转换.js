// 3.
// 进制转换
// 写出一个程序，接受一个十六进制的数，输出该数值的十进制表示。

// 数据范围：保证结果在 1 \le n \le 2^{31}-1 \1≤n≤2 
// 输入例子：
// 0xAA
// 输出例子：
// 170

const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void async function () {
    // Write your code here
    while(line = await readline()){
        let tokens = line.split(' ');
        let a = parseInt(tokens[0]);
        console.log(a);
    }
}()
