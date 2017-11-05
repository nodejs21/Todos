/**
 * Created by root on 10/30/2017.
 */

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var {mongoose} = require('./../db/mongoose');
var {people} = require('./../models/people');

router.post('/', (req, res, next) => {
    var body = _.pick(req.body, ['fname', 'lname', 'email', 'password', 'state_of_todo', 'status_of_person']);
    var person = new people(body);
    person.save().then((person) => {
        return res.json(person);
    }).catch((err) => {
        if(err.name === "MongoError" && err.code === 11000) {
            return res.send(`email "${body.email}" alredy exists!!`)
        }
        return res.status(500).send("error thrown from /routes/signUp.js/post!\n"+err);
    });
});

module.exports = router;
