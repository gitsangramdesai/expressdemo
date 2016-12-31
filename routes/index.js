var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

var connectionString = require(path.join(__dirname,  '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*get all */
router.get('/api/v1/todos', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        var query = client.query("SELECT * FROM items ORDER BY id ASC;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

/*get by id */
router.get('/api/v1/todo/:todo_id', function(req, res) {
    var results = [];
    var data = {id: req.params.todo_id};

    console.log('***' + req.params.todo_id);

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        var query = client.query("SELECT * FROM items WHERE id=($1) ORDER BY id ASC;",[data.id]);
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

/*add */
router.post('/api/v1/todos', function(req, res) {
    var results = [];
    console.log('Log:' + JSON.stringify(req.body));
    var data = {text: req.body.text, complete: false};
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);
        var query = client.query("SELECT * FROM items ORDER BY id ASC");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});



//update
router.put('/api/v1/todos/:todo_id', function(req, res) {
    var results = [];
    var id = req.params.todo_id;
    var data = {text: req.body.text, complete: req.body.complete};
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }
        client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);
        var query = client.query("SELECT * FROM items ORDER BY id ASC");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

//delete
router.delete('/api/v1/todos/:todo_id', function(req, res) {
    var results = [];
    var id = req.params.todo_id;
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        client.query("DELETE FROM items WHERE id=($1)", [id]);
        var query = client.query("SELECT * FROM items ORDER BY id ASC");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

module.exports = router;



