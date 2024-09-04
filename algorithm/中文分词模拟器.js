

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
  let line = await readline();
  let todoStr = line.split(' ')[0]
  console.log(todoStr,'todoStr');
  let line2 = await readline();
  // 保证最长匹配
  let dictionary = line2.split(',').sort((a, b) => b.length - a.length);
  // 空列表存储分词结果
  const doingStack = [];
  for (let i = 0; i < todoStr.length; ) {
    // 从第一个字符开始向后匹配
    const char = todoStr[i];
    if (!/[a-zA-z]/.test(char)) {
      i++;
      continue;
    }
    const stackLen = doingStack.length;
    for (let word of dictionary) {
      // 匹配最长的单词
      if (todoStr.startsWith(word,i)) {
        doingStack.push(word);
        break;
      }
    }
    if (doingStack.length > stackLen) {
      // 后移一个单词
      i += doingStack[doingStack.length - 1].length;
    } else {
      // 未匹配，单个单词插入
      doingStack.push(char);
      i++;
    }
  }
  console.log(doingStack.join(','));

  process.exit();
})();
