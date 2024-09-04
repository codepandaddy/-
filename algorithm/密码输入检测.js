const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
  while ((line = await readline())) {
    const tokens = line.split(' ');
    const str = tokens[0];
    const stack = [];
    let valid = true;
    for (const char of str) {
      if (char === '<' && stack.length) {
        stack.pop();
      } else {
        stack.push(char);
      }
    }
    const pwd = stack.join('');
    const regs = [/[A-Z]/,/[a-z]/,/\d/,/[^a-zA-Z0-9]/];
    
    valid = regs.every(reg => reg.test(pwd)) && stack.length>7;
    console.log(pwd + ',' + valid);
  }
})();
