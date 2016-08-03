var pg = require('pg');
//connection string format mysql://user:pass@example.com:9821/dbname
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:sangram@localhost:5432/poc';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });