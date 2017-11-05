const mongoose = require('mongoose');
const validator = require('validator');

var people = mongoose.model('persons', {
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            isAsync: false,
            message: '${value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    status_of_person: [{
        text: {
            type: String,
            trim: true,
            default: "right now i am..."
        }
    }],
    todos: [{
            text: {
                type: String,
                trim: true,
                default: "i'll remind you this later :)"
            },
            updated_on: {
                type: Date
            },
            state_of_todo: {
                type: String,
                default: "pending",
                trim: true
            }
        }]
    /*required: [
        "fname",
        "lname",
        "email",

    ]*/
});

module.exports = {people};
