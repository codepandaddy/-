
const game = require('./lib.js');

// const result = game(playerAction);
// console.log(result);
let count = 0;
process.stdin.on('data', e=>{
  const playerAction = e.toString().trim();
  const result = game(playerAction);
  console.log(result);

  if (result == 1) {
    count++;
  }
  if (count == 3){
    console.log('no!!');
    process.exit()
  }
})