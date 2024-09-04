class Position {
  constructor(x, y, day = 0) {
    this.x = x;
    this.y = y;
    this.day = day;
  }
}

function dayAllInfect(map) {
  const n = map.length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  const infected = [];
  let nowDay = 0;
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      if (map[x][y] === 1) {
        infected.push(new Position(x, y));
      }
    }
  }
  if (infected.length === Math.sqrt(n)) {
    return nowDay;
  }
  while (infected.length) {
    const infectPosition = infected.shift();
    const x = infectPosition.x,
      y = infectPosition.y,
      day = infectPosition.day;
    for (const key of directions) {
      const newX = x + key[0];
      const newY = y + key[1];
      if (newX >= n || newY >= n || newX < 0 || newY < 0) continue;
      const newDay = day + 1;
      const dir = map[newX][newY];
      if (dir === 1) {
        continue;
      }
      map[newX][newY] = 1;
      nowDay = Math.max(nowDay, newDay);
      infected.push(new Position(newX, newY, newDay));
    }
  }
  return nowDay;
}

const map = [
  [1, 0, 0, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 0, 0, 0]
];

console.log(dayAllInfect(map));
