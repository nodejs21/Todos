const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// admin:root@ds139585.mlab.com:39585/db_todos

mongoose.connect('mongodb://admin:root@ds139585.mlab.com:39585/db_todos', {
    useMongoClient: true
});

module.exports = {mongoose};