const express = require('express');
const app = express();

// 全局生效
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
})

app.get('/user', (req, res) => {
  console.log(req.body);
  res.send('ok')
})

app.listen(80, () => {
  console.log('simple middle ware');
})