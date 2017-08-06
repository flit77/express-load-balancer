const express = require('express');
const request = require('request');
const servers = ['http://localhost:3000', 'http://localhost:3001'];
let cur = 0;

const handler = (req, res) => {
  const _req = request({ url: servers[cur] + req.url }).on('error', error => {
    res.status(500).send(error.message);
  });
  req.pipe(_req).pipe(res);
  cur = (cur + 1) % servers.length;
};
const server = express().get('*', handler).post('*', handler);

server.listen(8080);
