// 3.
// 数独
// 数独是一个我们都非常熟悉的经典游戏，运用计算机我们可以很快地解开数独难题，现在有一些简单的数独题目，请编写一个程序求解。
// 如有多解，输出一个解
// 时间限制：C/C++ 1秒，其他语言2秒
// 空间限制：C/C++ 32M，其他语言64M
// 输入描述：
// 输入9行，每行为空格隔开的9个数字，为0的地方就是需要填充的。
// 输出描述：
// 输出九行，每行九个空格隔开的数字，为解出的答案。
const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
    // Write your code here
    const board = [];
    while ((line = await readline())) {
        let tokens = line.split(" ").map(i => parseInt(i));
        board.push(tokens);
    }
    function checkValid(sudo, i, j) {
        let row = {},
            col = {},
            subSudo = {};
        for (let k = 0; k < 9; k++) {
            let cur1 = sudo[i][k],
                cur2 = sudo[k][j];
            if (cur1) {
                if (row[cur1]) return 1;
                else row[cur1] = cur1;
            }
            if (cur2) {
                if (col[cur2]) return 2;
                else col[cur2] = cur2;
            }
            let key =
                sudo[Math.floor(k / 3) + Math.floor(i / 3) * 3][
                    Math.floor(j / 3) * 3 + Math.floor(k % 3)
                ];
            if (subSudo[key]) return 3;
            else subSudo[key] = key;
        }
        return 0;
    }
    let stack = [],
        flag;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; ) {
            if (board[i][j] === 0 || flag) {
                flag = false;
                let k = board[i][j] + 1;
                while (k < 10) {
                    board[i][j] = k;
                    if (checkValid(board, i, j) == 0) {
                        stack.push([i, j++]);
                        break;
                    }
                    k++;
                }
                if (k > 9) {
                    board[i][j] = 0;
                    let re = stack.pop();
                    if (re) {
                        i = re[0];
                        j = re[1];
                        flag = true;
                    }
                }
            } else {
                j++;
            }
        }
    }
    for (let row of board) {
        console.log(row.join(" "));
    }
})();
