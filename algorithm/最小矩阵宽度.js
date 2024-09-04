// const rl = require('readline').createInterface({ input: process.stdin });
// var iter = rl[Symbol.asyncIterator]();
// const readline = async () => (await iter.next()).value;

// void (async function () {
//   let n, m, k;
//   let matrix = [];
//   let nums;
//   while ((line = await readline())) {
//     let tokens = line.split(' ');
//     if (!n || !m) {
//       n = tokens[0];
//       m = tokens[1];
//       continue;
//     }
//     if (matrix.length < n) {
//       matrix.push(tokens.map((i) => +i));
//       continue;
//     }
//     if (!k) {
//       k = tokens[0];
//       continue;
//     }
//     nums = tokens.map((i) => +i);
//     rl.close();
//     break;
//   }
//   const targetMap = nums.reduce((p, v) => (p[v] = (p[v] || 0) + 1), {});
//   let minCols = m + 1;
//   let found = false;
//   for (let i = 0; i < n; i++) {
//     const countMap = {};
//     let start = 0;
//     for (let j = 0; j < m; j++) {
//       const num = matrix[i][j];
//       if (targetMap[num]) {
//         countMap[num] = countMap[num] || 0 + 1;
//       }
//       while (isEqual(targetMap,countMap)) {
//         minCols = Math.min(minCols,j-start+1);
//         found = true;
//         const leftNum = matrix[i][start++];
//         if (targetMap[leftNum]) {
//           countMap[leftNum]--;
//           if (countMap[leftNum] === 0) {
//             countMap[leftNum] = undefined;
//           }
//         }
//       }
//     }
//   }
//   console.log(found ? minCols : -1);
//   process.exit();
// })();
// function isEqual(mapa,mapb) {
//   if (mapa.size !== mapb.size) return false;
//   for (const [key,val] of mapa) {
//     if (!mapb[key] || mapb[key] !== val) return false;
//   }
//   return true;
// }
function findMinWidth(matrix, targets) {
  const targetCount = new Map();
  targets.forEach(target => {
      targetCount.set(target, (targetCount.get(target) || 0) + 1);
  });

  const rows = matrix.length;
  const cols = matrix[0].length;
  let minCols = cols + 1;
  let found = false;

  for (let i = 0; i < rows; i++) {
      const countMap = new Map();
      let start = 0;
      for (let end = 0; end < cols; end++) {
          const num = matrix[i][end];
          if (targetCount.has(num)) {
              countMap.set(num, (countMap.get(num) || 0) + 1);
          }
          while (isEqual(countMap, targetCount)) {
              minCols = Math.min(minCols, end - start + 1);
              found = true;
              const leftNum = matrix[i][start++];
              if (targetCount.has(leftNum)) {
                  countMap.set(leftNum, countMap.get(leftNum) - 1);
                  if (countMap.get(leftNum) === 0) {
                      countMap.delete(leftNum);
                  }
              }
          }
      }
  }
  return found ? minCols : -1;
}

function isEqual(mapA, mapB) {
  if (mapA.size !== mapB.size) return false;
  for (let [key, val] of mapA) {
      if (!mapB.has(key) || mapB.get(key) !== val) return false;
  }
  return true;
}

// Example usage:
const matrix = [
  [1, 2, 2, 3, 1],
  [2, 3, 2, 3, 2]
];
const targets = [1, 2, 3];
console.log(findMinWidth(matrix, targets)); // Output: 2
