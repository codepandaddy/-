const rl = require('readline').createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void (async function () {
  const r = +(await readline());
  const c = +(await readline());
  let curr = 0;
  const map = Array.from({ length: r }, () => Array(c).fill(0));
  while (curr < r) {
    const line = await readline();
    map[curr] = line.split(' ').map((i) => +i);
    curr++;
  }
  console.log(map);
  class State {
    constructor(x, y, min = 0) {
      this.x = x;
      this.y = y;
      this.min = min;
    }
  }
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  const visited = Array.from({ length: r }, () => Array(c).fill(0));
  const first = new State(0, 0, Number.MAX_VALUE);
  const ans = [];
  dfs(map, visited, first, 0, 0, ans);
  ans.sort((a,b)=>b.min-a.min)
  if (ans.length) console.log(ans[0]);
  else console.log(0);
  function dfs(map, visited, state, i, j, ans) {
    if (i < 0 || i >= r || j < 0 || j >= c || visited[i][j]) {
      return;
    }
    if (state.x === r - 1 && state.y === c - 1) {
      ans.push(state);
      return;
    }
    visited[i][j] = 1;
    state = new State(i, j, Math.min(state.min, map[i][j]));
    for (const d of directions) {
      dfs(map, visited, state, i + d[0], j + d[1], ans);
    }
    visited[i][j] = 0;
  }
  // while (queue.length > 0) {
  //   const { x, y, min } = queue[0];
  //   if (x === r - 1 && y === c - 1) {
  //     return console.log(min);
  //   }
  //   let maxState;
  //   for (const [dx, dy] of directions) {
  //     const newI = x + dx;
  //     const newJ = y + dy;
  //     if (
  //       newI < 0 ||
  //       newI >= r ||
  //       newJ < 0 ||
  //       newJ >= c ||
  //       visited[newI][newJ]
  //     ) {
  //       continue;
  //     }
  //     if (maxState) {
  //       if (map[maxState.x][maxState.y] < map[newI][newJ]) {
  //         maxState = new State(newI, newJ);
  //       }
  //     } else {
  //       maxState = new State(newI, newJ);
  //     }
  //   }
  //   queue[0] = maxState;
  // }
})();
// function maxSignalRoute(Cov, sr, sc, er, ec) {
//   if (sr === er && sc === ec) {
//       return Cov[sr][sc];
//   }

//   const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
//   let maxSignal = -Infinity;

//   for (const [dx, dy] of dirs) {
//       const nr = sr + dx;
//       const nc = sc + dy;

//       if (nr >= 0 && nr < Cov.length && nc >= 0 && nc < Cov[0].length) {
//           const signal = Math.min(Cov[sr][sc], maxSignalRoute(Cov, nr, nc, er, ec));
//           maxSignal = Math.max(maxSignal, signal);
//       }
//   }

//   return maxSignal;
// }

// const readline = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// const lines = [];
// readline.on('line', (line) => {
//   lines.push(line);
//   if (lines.length === 3) {
//       const R = parseInt(lines[0]);
//       const C = parseInt(lines[1]);
//       const Cov = lines[2].split(' ').map(Number).reduce((acc, val, idx) => {
//           if (idx % C === 0) acc.push([]);
//           acc[acc.length - 1].push(val);
//           return acc;
//       }, []);

//       readline.close();
//       console.log(maxSignalRoute(Cov, 0, 0, R - 1, C - 1));
//   }
// });
