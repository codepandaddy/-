var playerAction = process.argv[process.argv.length - 1];
var random = Math.random() * 3;
if (random < 1) {
  var computerAction = 'rock'
} else if (random > 2) {
  var computerAction = 'scissor'
} else {
  var computerAction = 'paper';
}

if (playerAction == computerAction) {
  console.log('平局');
} 