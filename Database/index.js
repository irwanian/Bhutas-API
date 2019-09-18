const mySql = require('mysql')

var connection = mySql.createConnection({
        // host : 'db4free.net',
        host : 'localhost',
        user : 'irwanian',
        password: 'ramadhanideas',
        database : 'bhutas',
        port : 3306,
        multipleStatements: true
})

module.exports = connection