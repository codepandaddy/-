const rl = require('readline').createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
  const lineLength = 2;
  let i = 0;
  let tokens = [];
  while(i++ < lineLength) {
    let line = await readline();
    tokens.push(line.split(' '));
  }
  const oldsquence = tokens[0].map(v => +v);
  const newsquence = tokens[1].map(v => +v);
  let position = new Array(newsquence.length).fill(-1);
  for (let i = 0; i < oldsquence.length; i++) {
    for (let j = 0; j < newsquence.length; j++) {
      if (newsquence[j] === oldsquence[i] && position[j] === -1) {
        position[j] = i;
        break;
      }
    }
  }
  let adjustments = 0;
  for (let i = 0; i < position.length; i = i + 3) {
    const dv = [];
    for (let n = 0; n < 3; n++) {
      dv.push(position[i + n]/3|0);
    }
    if (dv[0] === dv[1] && dv[0] === dv[2]) {
      continue;
    }
    for (let k = 0; k < dv.length; k++) {
      const num = dv[k];
      let isUnequal = true;
      for (let j = 0; j < dv.length; j++) {
        const sub = dv[j];
        if (sub === num && k !== j) {
          isUnequal = false;
          break;
        }
      }
      if (!isUnequal) {
        adjustments++;
      }
      
    }
  }
  console.log(Math.floor(adjustments/2));
  process.exit();
})();
