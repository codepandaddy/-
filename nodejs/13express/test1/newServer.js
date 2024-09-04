const express = require('express');
const app = express();

app.get('/user/:id', (req, res) => {
  console.log(req.params);
  res.send({name: 'Bob', age: 20})
})

app.post('/user', (req, res) => {
  res.send('success')
})

app.listen(80, () => {
  console.log('running');
})