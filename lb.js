const express = require('express');
const fs = require('fs');
const https = require('https');
const request = require('request');
const servers = ['http://localhost:3000', 'http://localhost:3001'];
let cur = 0;

const sslOptions = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.cert')
};

const profilerMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log('Completed', req.method, req.url, Date.now() - start);
  });
  next();
};

const handler = (req, res) => {
  const _req = request({ url: servers[cur] + req.url }).on('error', error => {
    res.status(500).send(error.message);
  });
  req.pipe(_req).pipe(res);
  cur = (cur + 1) % servers.length;
};

const app = express()
  .use(require('express-sslify').HTTPS())
  .use(profilerMiddleware)
  .get('*', handler)
  .post('*', handler);

app.listen(8080);

https.createServer(sslOptions, app).listen(443);
