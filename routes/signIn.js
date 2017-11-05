/**
 * Created by root on 10/30/2017.
 */

var express = require('express');
var router = express.Router();

var {mongoose} = require('./../db/mongoose');
var {people} = require('./../models/people');

router.post('/', (req, res, next) => {
    var user_email = req.body.email;
    var user_password = req.body.password;
    people.find({email: user_email}).then((user) => {
        if(user.length == 0) {
            return res.send(`no user against: ${user_email}`);
        }
        if(user[0].password === user_password) {
            return res.json(user);
        }
        user = undefined;
        return res.send("access denied!!");
    }).catch((err) => {
        return res.status(404).send('error thrown from /routes/signin.js\n'+err);
    });
    return 0;
});

module.exports = router;





























