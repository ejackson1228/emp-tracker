const db = require('./db/connection');



// connect to db after connection 
db.connect(err => {
    if(err) throw err;
    console.log(`
     __________________
    |                  |
    |Database connected|
    |__________________|
     `);
});

module.exports = db