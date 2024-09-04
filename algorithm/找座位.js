const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
  while ((line = await readline())) {
    let tokens = line.split('').map((i) => parseInt(i));
    let sum = 0;
    let start = 0;
    let count = 0;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === 0) {
        count++;
        continue;
      }
      if (i === 0) {
        continue;
      }
      const start_num = tokens[start];
      const r = count % 2;
      if (r === 0) {
        sum += start_num === 0 ? count / 2 : count / 2 - 1;
      } else {
        sum += (count / 2) | 0;
      }
      count = 0;
      start = i;
    }
    if (count) {
      const start_num = tokens[start];
      const r = count % 2;
      if (r === 0) {
        sum += count / 2;
      } else {
        sum += start_num === 0 ? ((count / 2) | 0) + 1 : (count / 2) | 0;
      }
    }
    console.log(sum);
  }
})();
