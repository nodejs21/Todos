/**
 * Created by root on 11/4/2017.
 */
var express = require('express');
var router = express.Router();

var {ObjectId} = require('mongodb');
var {people} = require('./../models/people');

router.put('/:email/:id', (req, res, next) => {
    var email = req.params.email;
    var id = req.params.id;
    var text = req.body.text;
    people.update({email: email, status_of_person: {$elemMatch: {_id: id}}}, {$set: {"status_of_person.$.text": text}}, (err, person) => {
        if(err) {
            return res.send(`error from update in todos.js status_of_person\n${err}`);
        } else if(person.n === 0) {
            return res.json(person);
        }
        res.json(person);
    });
});

module.exports = router;