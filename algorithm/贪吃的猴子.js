const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
  let line = await readline();
  const len = line.split(' ')[0];
  line = await readline();
  const numbers = line.split(' ').map(n => parseInt(n));
  line = await readline();
  const n = line.split(' ')[0];

  let left = 0;
  let right = numbers.length - 1;
  let total1 = 0;
  let total2 = 0;
  for (let i = 1; i <= n; i++) {
    total1 += numbers[left++];
    total2 += numbers[right--];
  }
  console.log(Math.max(total1,total2))
})();