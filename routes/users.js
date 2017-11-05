var express = require('express');
var router = express.Router();

const {mongoose} = require('./../db/mongoose');
const {people} = require('./../models/people');

/* GET users listing. */
router.get('/', function(req, res, next) {
    people.find().then((people) => {
        res.json(people);
    }).catch((err) => {
       res.status(500).send('some error thrown from get/users.js');
    });
});

module.exports = router;
