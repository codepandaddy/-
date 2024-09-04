const express = require('express');
const app = express();

// 全局生效
app.use((err, req, res, next) => {
  console.log('midFn', err.message);
  // 上游挂载属性
  const time = Date.now();
  req.startTime = time;
  next()
})

app.use((err, req, res, next) => {
  console.log('midFn22', err.message);
  // 上游挂载属性
  const time = Date.now();
  req.endTime = time;
  next()
})

app.get('/', (req, res) => {
  throw new Error('瞎编的')
  res.send('home page' + '---' + req.startTime + '---' + req.endTime)
})

app.get('/user', (req, res) => {
  res.send('get user' + '---' + req.startTime + '---' + req.endTime)
})

app.listen(80, () => {
  console.log('simple middle ware');
})