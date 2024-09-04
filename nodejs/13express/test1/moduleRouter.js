const express = require('express');
const app = express();

// 注册全局中间件
app.use('/api', require('./router'))


app.listen(80, () => {
  console.log('running');
})