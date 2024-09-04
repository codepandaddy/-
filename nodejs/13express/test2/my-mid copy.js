// const express = require('express');
const qs = require('querystring');

const bodyParser = (req, res, next) => {
  let str = '';
  req.on('data', (chunk) => {
    str += chunk;
  })
  req.on('end', () => {
    const body = qs.parse(str);
    req.body = body;
    next()
  })
  
  // res.send(str);
}

module.exports = bodyParser