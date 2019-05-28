const express = require('express');
const knex = require('knex');

const router = express.Router();

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.sqlite3' //from the root folder
    },
    useNullAsDefault: true
    // debug : true
};

const db = knex(knexConfig);

// endpoints heres
router.get('/api/zoos', (req, res) => {
    db('zoos') // returns a promise with all the rows
        .then(response => {
        if (!response || Object.keys(response).length === 0) {
            res
                .status(400)
                .json({message: 'Could not find any zoos in database'})
        } else {
            res
                .status(200)
                .json(response);
        }
    }).catch(err => {
        console.log(err)
        res
            .status(500)
            .json(err);
    });
});

router.get('/api/zoos/:id', (req, res) => {
    db('zoos')
        .where({id: req.params.id})
        .first() // will return us an object instead of an array
        .then(zoo => {
            if (!zoo || Object.keys(zoo).length === 0) {
                return res
                    .status(400)
                    .json({message: 'Zoo with given ID not found in database'})
            } else {
                res
                    .status(200)
                    .json(zoo)
            }
        })
        .catch(err => {
            res
                .status(500)
                .json(err);
        })
});

router.post('/api/zoos', (req, res) => {
    // INSERT INTO Zoos (title) VALUES ('Slaughterhouse Five'); second argument for
    // insert is what we want returned from the promise, in this case we want the
    // name back
    db('zoos')
        .insert(req.body, 'id')
        .then(response => {
            db('zoos').where({id: response[0]}) // grabbing first item with matching id
                .first() // will return us an object instead of an array
                .then(zoo => {
                res
                    .status(200)
                    .json(zoo);
            }).catch(err => {
                res
                    .status(500)
                    .json(err);
            });
            res
                .status(200)
                .json(response)
        })
        .catch(err => {
            res
                .status(500)
                .json(err);
        });
});

router.put('/api/zoos/:id', (req, res) => {
    db('zoos')
        .where({id: req.params.id})
        .update(req.body)
        .then(count => {
            if (count > 0) {
                res
                    .status(200)
                    .json({
                        message: `${count} ${count > 1
                            ? 'records updated'
                            : 'record updated'}`
                    });
            } else {
                res
                    .status(404)
                    .json({message: 'Zoo with specified ID not found'})
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({err});
        });
});

router.delete('/api/zoos/:id', (req, res) => {
    db('zoos')
        .where({id: req.params.id})
        .delete(req.body)
        .then(count => {
            if (count > 0) {
                res
                    .status(201)
                    .json({message: 'Zoo has been deleted from database'})
            } else {
                res
                    .status(404)
                    .json({message: 'Zoo with specified ID not found'})
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({err});
        });
});

module.exports = router;