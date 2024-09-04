const express = require('express');
const bodyParser = require('./my-mid copy')

const app = express();

// 解析表单数据
app.use(bodyParser)


app.get('/user', (req, res) => {
  console.log(req.body);
  res.send(req.body)
})

app.listen(80, () => {
  console.log('my middle ware');
})