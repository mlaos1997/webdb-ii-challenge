const express = require('express');
const helmet = require('helmet');

const server = express();

const zoosRouter = require('./routes/zoosRouter.js');

server.use(express.json());
server.use(helmet());

server.use('/api/zoos', zoosRouter);

server.get('/', (req, res) => {
    res.send('<h1>Web DB II Challenge');
});

module.exports = server;
