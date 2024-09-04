const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const dirPaths = ['/'];
let path = 0;
let result;

readline
  .on('line', (command) => {
    processCommand(command);
  })
  .on('close', () => {
    console.log(result);
  });

function processCommand(command) {
  if (command.startsWith('mkdir')) {
    const dirName = dirPaths[path] + command.substring(5) + '/';
    if (!dirPaths.includes(dirName)) {
      dirPaths.push(dirName);
      result = dirName + '/';
    }
  } else if (command.startsWith('cd')) {
    const dirName = command.substring(2);
    if (dirName === '..') {
      const curr = dirPaths[path].split('/');
      curr.pop();
      if (curr.length === 2) {
        result = '';
        return;
      }
      result = getCurrentPath(curr);
      path = dirPaths.findIndex((p) => p === result);
      return;
    }

    const dp = dirPaths[path] + dirName + '/';
    const dpindex = dirPaths.findIndex((p) => p === dp);
    if (dpindex > -1) {
      path = dpindex;
      result = dp;
    } else {
      result = '';
    }
  }
}

function getCurrentPath(arr) {
  return arr.join('/');
}
