const express = require('express');
const app = express();

const router = require('./apiRouter');
// 必须在前面
app.use(express.urlencoded({ extended: false }))

// npm i cors 解决跨域问题
const cors = require('cors');
app.use(cors())

// 这个在后面
app.use('/api', router)

app.listen(80, () => {
  console.log('my middle ware');
})