const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.sqlite3' //from the root folder
    },
    useNullAsDefault: true
    // debug : true
};

const db = knex(knexConfig);
const server = express();

server.use(express.json());
server.use(helmet());

// endpoints heres
server.get('/api/zoos', (req, res) => {
    db('zoos') // returns a promise with all the rows
        .then(response => {
        res
            .status(200)
            .json(response);
    }).catch(err => {
        console.log(err)
        res
            .status(500)
            .json(err);
    });
});

server.get('/api/zoos/:id', (req, res) => {
    db('zoos')
        .where({id: req.params.id})
        .first() // will return us an object instead of an array
        .then(zoo => {
            res
                .status(200)
                .json(zoo)
        })
        .catch(err => {
            res
                .status(500)
                .json(err);
        })
});

server.post('/api/zoos', (req, res) => {
    // INSERT INTO Zoos (title) VALUES ('Slaughterhouse Five'); second argument for
    // insert is what we want returned from the promise, in this case we want the
    // name back
    db('zoos')
        .insert(req.body, ['id'])
        .then(response => res.status(200).json(response))
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .json(err);
        });
});

const port = 3300;
server.listen(port, function () {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
