const express = require('express');
const app = express();

// 先中间件再路由
const mw1 = (req, res, next) => {
  console.log('midFn');
  next()
}

const mw2 = (req, res, next) => {
  console.log('midFn222');
  next()
}

app.get('/', mw1, (req, res) => {
  res.send('home page')
})

app.get('/user', mw1, mw2, (req, res) => {
  res.send('get user')
})

app.get('/user/list', [mw1, mw2], (req, res) => {
  res.send('get user list')
})

app.listen(80, () => {
  console.log('simple middle ware');
})