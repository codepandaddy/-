// 1.
// 汽水瓶
// 某商店规定：三个空汽水瓶可以换一瓶汽水，允许向老板借空汽水瓶（但是必须要归还）。
// 小张手上有n个空汽水瓶，她想知道自己最多可以喝到多少瓶汽水。
// 数据范围：输入的正整数满足 1 \le n \le 100 \1≤n≤100 

// 注意：本题存在多组输入。输入的 0 表示输入结束，并不用输出结果。

// 输入例子：
// 3
// 10
// 81
// 0
// 输出例子：
// 1
// 5
// 40
// 例子说明：
// 样例 1 解释：用三个空瓶换一瓶汽水，剩一个空瓶无法继续交换
// 样例 2 解释：用九个空瓶换三瓶汽水，剩四个空瓶再用三个空瓶换一瓶汽水，剩两个空瓶，向老板借一个空瓶再用三个空瓶换一瓶汽水喝完得一个空瓶还给老板    

const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void async function () {
    // Write your code here
    while(line = await readline()){
        let tokens = line.split(' ');
        for (let num of tokens) {
            let ec = parseInt(num);
            let fc = 0;
            while (ec/3>=1) {
                const cc = ec/3 | 0;
                // console.log(num,cc)
                fc += cc;
                ec = ec - cc*2;
                if (ec == 2) {
                    ec++;
                }
            }
            if (num == 0) {
                break;
            }
            console.log(fc);
        }
    }
}()
