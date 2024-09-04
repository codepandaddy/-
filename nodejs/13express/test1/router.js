// 路由模块
const express = require('express');

const router = express.Router()

router.get('/user/list', (req, res) => {
  res.send('get user list')
})

router.post('/user/add', (req, res) => {
  res.send('add user list')
})

module.exports = router