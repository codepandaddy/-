const gt = require('./index')

gt.addListener('newlesson', (p) => {
  console.log('yeah@', p);
})