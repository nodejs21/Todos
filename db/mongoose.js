const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// admin:root@ds139585.mlab.com:39585/db_todos

mongoose.connect('admin:root@ds139585.mlab.com:39585/db_todos', {
    useMongoClient: true
});

module.exports = {mongoose};
