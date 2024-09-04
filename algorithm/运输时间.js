const m = 4;
const n = 16;
const ss = [4, 3, 5, 7];

let result = 0;
for (let i = 0; i < m; i++) {
  let t = n / ss[i];
  if (i === 0 || result < t + i) {
    result = t + i;
    continue;
  }
  
}
console.log(result);
