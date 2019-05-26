const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3' //from the root folder
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);
const server = express();

server.use(express.json());
server.use(helmet());

// endpoints heres
server.get('/', (req, res) => {
  db('zoos')
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => console.log(err));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});


