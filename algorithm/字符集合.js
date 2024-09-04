// 2.
// 字符集合
// 输入一个字符串，求出该字符串包含的字符集合，按照字母输入的顺序输出。

// 数据范围：输入的字符串长度满足 1 \le n \le 100 \1≤n≤100  ，且只包含大小写字母，区分大小写。

// 本题有多组输入
// 时间限制：C/C++ 1秒，其他语言2秒
// 空间限制：C/C++ 32M，其他语言64M
// 输入描述：
// 每组数据输入一个字符串，字符串最大长度为100，且只包含字母，不可能为空串，区分大小写。
// 输出描述：
// 每组数据一行，按字符串原有的字符顺序，输出字符集合，即重复出现并靠后的字母不输出。
// 示例1
// 输入例子：
// abcqweracb
// 输出例子：
// abcqwer
// 示例2
// 输入例子：
// aaa
// 输出例子：
// a

const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
    while ((line = await readline())) {
        let tokens = line.split(" ");
        let str = tokens[0];
        let st = new Set();
        let arr = [];
        for (let i of str) {
            if (st.has(i)) {
                continue;
            }
            arr.push(i);
            st.add(i);
        }
        console.log(arr.join(""));
    }
})();
