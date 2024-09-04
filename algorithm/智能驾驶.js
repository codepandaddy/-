const rl = require('readline').createInterface({ input: process.stdin });
const iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;
// TODO
void (async function () {
  const board = [];
  let firstline = (await readline()).split(',');
  let row = firstline[0];
  let col = firstline[1];
  let count = 0;
  const restOils = {}; // 走同样步数剩下的油量
  while (count < row) {
    const line = await readline();
    const tokens = line.split(',').map((n,index) => {
      let newN = parseInt(n);
      if (newN === -1) {
        restOils[''+(count-1)+index] = newN;
      }
      return newN;
    });
    count++;
    board.push(tokens);
    if (row === count) break;
  }
  const visited = Array.from({length:row},() => Array(col).fill(0));
  const MAX_OIL = 100;
  const queue = [new State(0, 0, MAX_OIL, Number.MAX_SAFE_INTEGER)];
  
  const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  const needOils = [];
  const hasRoote = false;
  while (queue.length > 0) {
    const state = queue.shift();
    const x = state.x,
      y = state.y,
      restOil = state.restOil,
      needOil = state.needOil;
    if (x === row - 1 && y === col - 1) {
      needOils.push(needOil);
      continue;
    }
    for (const dir of DIRECTIONS) {
      const newX = x + dir[0],
        newY = y + dir[1];
      if (
        newX < 0 ||
        newX >= row ||
        newY < 0 ||
        newY >= col ||
        visited[newX][newY]
      )
        continue;
      const needed = board[newX][newY];
      if (needed === 0) {
        visited[newX][newY] = 1;
        continue;
      }
      let newRestOil = restOil - needed;
      if (newRestOil < 0) continue;
      let newNeedOil = needOil;
      if (needed === -1) {
        let temp_rest = restOils[''+newX+newY];
        if (newRestOil>=temp_rest) continue;
        newRestOil = MAX_OIL;
        visited[newX][newY] = 0;
      } else {
        newNeedOil += board[newX][newY];
        visited[newX][newY] = 1;
      }
      queue.push(new State(newX, newY, newRestOil, newNeedOil));
    }
  }
  if (needOils.length) {
    console.log(needOils.sort((a, b) => a - b)[0]);
  } else {
    console.log(-1);
  }
  process.exit();
})();

class State {
  constructor(x, y, restOil, needOil) {
    this.x = x;
    this.y = y;
    this.restOil = restOil;
    this.needOil = needOil;
  }
}
