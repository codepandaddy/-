const express = require('express');
const app = express();


app.use(express.static('../1test/clock'))

// 挂载路径前缀
app.use('/aaa', express.static('../1test/clock'))

app.listen(80, () => {
  console.log('1111');
})