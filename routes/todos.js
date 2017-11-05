/**
 * Created by root on 10/31/2017.
 */

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var {ObjectId} = require('mongodb');

var {people} = require('./../models/people');

/*******************************************************
 POST TODO
 *******************************************************/

router.post('/:email', (req, res, next) => {
    var user_email = req.params.email;
    var todo = req.body.todos;
    var status = req.body.status_of_person;
    var doc;
    /*if(todo === null && status === null) {
     return res.send("Todo and Status is empty!!");
     }*/
    if(!todo) {
        doc = {
            $push: {status_of_person: status}
        };
    } else if(!status) {
        doc = {
            $push: {todos: todo}
        };
    } else {
        doc = {
            $push: {todos: todo, status_of_person: status}
        };
    }
    people.findOneAndUpdate({email: user_email}, doc, {new: true}).then((person) => {
        res.json(person);
    }).catch((err) => {
        res.send("error thrown from /routes/todos.js POST todos\n"+err);
    });
});

/*******************************************************
 DELETE TODO OR STATUS
 *******************************************************/

router.delete('/:email/:id', (req, res, next) => {
    var email = req.params.email;
    var id = req.params.id;
    if(!ObjectId.isValid(id)) {
        return res.send("invalid id!!");
    }
    var query = {
        email: email
    };
    var doc = {
        $pull: {todos: {_id: ObjectId(id)}, status_of_person: {_id: ObjectId(id)}}
    };
    people.update(query, doc, (err, person) => {
        if(err) {
            return res.send("error from /routes/todos.js.../:email/todo/:id\n\n"+err);
        } else if(person.nModified === 0) {
            return res.send(`no user found against: "${id}`);
        }
        res.json(person);
    });
});

/*******************************************************
 UPDATE STATE OF TODO
 *******************************************************/

// router.put('/:email/:state', (req, res, next) => {
//     updateState(req, res);
//     /*var email = req.params.email;
//      var state = req.params.state;
//      var req_todo_state = req.body.state_of_todo;
//      if(req_todo_state === "" || req_todo_state === null || !req_todo_state) {
//      return res.send(`please enter the new state for todos that are "${state}"!!`);
//      }
//      var query = {
//      "email": email,
//      todos: {$elemMatch: {state_of_todo: state}}
//      };
//      var doc = {
//      $set: {"todos.$.state_of_todo": req_todo_state}
//      };
//      people.find(query, {_id: 0, todos: 1}, (err, todosObj) => {
//      if(!todosObj || todosObj.length === 0 || todosObj === null) {
//      return res.send(`no todo against "${state}" found!!`);
//      }
//      todosObj[0].todos.forEach((obj) => {
//      if(obj.state_of_todo === state) {
//      people.update(query, doc, {"multi": true}, (err, person) => {});
//      }
//      });
//      people.find({email: email}, {todos: 1}, (err, person) => {
//      res.json(person);
//      });
//      });*/
// });

/*******************************************************
 UPDATE TODO's TEXT (ONE AT A TIME)
 *******************************************************/

router.put('/:email/:id', (req, res, next) => {
    var id = req.params.id;
    var patt = /[0-9]/;
    var result = patt.test(id);
    if(result) {
        if(!ObjectId.isValid(id)) {
            return res.send(`invalid id "${id}"`);
        }
        var email = req.params.email;
        var id = req.params.id;
        var text = req.body.text;
        var state = req.body.state_of_todo;
        var doc = {
            $set: {"todos.$.text": text, "todos.$.state_of_todo": state}
        };
        if(state === null || state === "" || !state) {
            doc = {
                $set: {"todos.$.text": text}
            }
        } else if (text === null || text === "" || !text) {
            doc = {
                $set: {"todos.$.state_of_todo": state}
            }
        }
        people.update({email: email, todos: {$elemMatch: {_id: id}}}, doc, (err, person) => {
            if(err) {
                return res.send(`error from update in todos.js\n${err}`);
            } else if(person.n === 0) {
                return res.json(person);
            }
            res.json(person);
        });
    } else {
        console.log("false");;
        return updateState(req, res);
    }
});

// function updateStatus(req, res) {
//     var email = req.params.email;
//     var id = req.params.id;
//     var text = req.body.text;
//     people.update({email: email, status_of_person: {$elemMatch: {_id: id}}}, {$set: {"status_of_person.$.text": text}}, (err, person) => {
//         if(err) {
//             return res.send(`error from update in todos.js status_of_person\n${err}`);
//         } else if(person.n === 0) {
//             res.send("no text found!!");
//         }
//             return true;
//     });
// }
/*function updateTodo(req, res) {
 var email = req.params.email;
 var id = req.params.id;
 var text = req.body.text;
 // people.update({email: email,$or: [
 //     {todos: {$elemMatch: {_id: id}}},
 //     {status_of_person: {$elemMatch: {_id: id}}},
 //     {"status_of_person.$.text":1}
 // ]}, {$set: {todos: {_id }}}, (err, personObj) => {
 //     res.json(personObj);
 // });
 people.update({email: email, todos: {$elemMatch: {_id: id}}}, {$set: {"todos.$.text":text}}, (err, person) => {
 if(err) {
 return res.send(`error from update in todos.js\n${err}`);
 } else if(person.n === 0) {
 console.log("here in else if!!");
 return 0;
 }
 console.log("herelkjasdlfjlas;djflasdjlfjasdl;j");
 return 1;
 });
 }*/

function updateState(req, res) {
    var email = req.params.email;
    var state = req.params.id;
    var req_todo_state = req.body.state_of_todo;
    if(req_todo_state === "" || req_todo_state === null || !req_todo_state) {
        return res.send(`please enter the new state for todos that are "${state}"!!`);
    }
    var query = {
        email: email,
        todos: {$elemMatch: {state_of_todo: state}}
    };
    var doc = {
        $set: {"todos.$.state_of_todo": req_todo_state}
    };
    people.find(query, {todos: 1}, (err, todosObj) => {
        if(err) {
            return res.json(`error from updateState(req, res):\n${err}`);
        }
        if(todosObj.n === 0) {
            return res.send(`no todo against "${state}" found!!`);
        }
        todosObj[0].todos.forEach((obj) => {
            if(obj.state_of_todo === state) {
                people.update(query, doc, (err, person) => {});
            }
        });
    });
    return res.send("updation done!!");
}

/*router.put('/:email/:state', (req, res, next) => {
 var user_email = req.params.email;
 var state = req.params.state;
 var todo = req.body.todos;
 var req_todo_text = todo.text;
 var req_todo_state = todo.state_of_todo;
 var query = {
 "email": user_email,
 todos: {$elemMatch: {state_of_todo: state}}
 };
 var doc;
 if(req_todo_text === null || req_todo_text === "" || !req_todo_text) {
 doc = {
 $set: {"todos.$.state_of_todo": req_todo_state}
 };
 } else if(req_todo_state === null || req_todo_state === "" || !req_todo_state) {
 doc = {
 $set: {"todos.$.text": req_todo_text}
 };
 } else {
 doc = {
 $set: {"todos.$.state_of_todo": req_todo_state, "todos.$.text": req_todo_text}
 };
 }
 people.find(query, {_id: 0, todos: 1}, (err, todosObj) => {
 if(!todosObj || todosObj.length === 0) {
 return res.send(`no todo against "${state}" found!!`);
 }
 for(x in todosObj) {
 var todosArray = todosObj[x].todos;
 todosArray.forEach((i) => {
 if(i.state_of_todo === state) {
 // console.log(`\n****************${JSON.stringify(doc, undefined, 2)}****************\n`)
 people.update(query, doc, {"multi": true}).then((person) => {
 /!*if(person === null) {
 res.send(`no todo against "${state}" found!!`);
 }*!/
 }).catch((err) => {
 res.send("error thrown from /routes/todos.js "+err);
 });
 }
 });
 people.find({email: user_email}, (err, person) => {
 res.json(person);
 });
 }
 });
 });*/

/*router.put('/:email/:todo', (req, res, next) => {
 var user_email = req.params.email;
 var text = req.params.todo;
 // var status = req.body.status_of_person;
 var todo = req.body.todos;

 // var last = {todos: {$slice: -1}, status_of_person: {$slice: -1}};

 /!*var body = {
 $push: {todos: todo},
 $set: {status_of_person: status}
 };

 if(body.$push == null) {
 console.log("i'm here in 1st if!");
 return body = _.pick(body, [$set]);
 } else if (body.$set == null) {
 console.log("i'm here in 2nd if!");
 return body = _.pick(body, [$push]);
 } else {
 console.log("i'm here in else!");
 }*!/

 people.find({email: user_email, todos: {text: "tilawat"}}).then((person) => {
 if(!person || person.length == 0) {
 return res.send(`no user found against "${user_email}"!!`)
 }
 // var i = 0;
 // for (a in person[0].todos[i++].text) {
 //     console.log(person[0].todos[a].text);
 // }
 // res.send(person[0].todos);
 res.json(person);
 }).catch((err) => {
 res.send("error thrown from /routes/todos.js "+err);
 });

 /!*people.update({email: user_email}, body, {new: true}).then((person) => {
 if(!person || person.length == 0) {
 return res.send(`no user found against "${user_email}"!!`)
 }
 return res.json(person);
 }).catch((err) => {
 res.send("error thrown from /routes/todos.js "+err);
 });*!/
 });*/

// router.put('/:email/:status', (req, res, next) => {
//
// });
//
// router.put('/:email/:todo/:status', (req, res, next) => {
//
// });
//
// router.get('/:id', (req, res, next) => {
//     // var todos =
// });

module.exports = router;