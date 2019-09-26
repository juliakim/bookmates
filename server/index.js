const express = require('express');
const bodyParser = require('body-parser');
const items = require('../database-mysql');
// const items = require('../database-mongo');

const app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/books', function (req, res) {
  items.selectAllFromBookshelf(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post('/books', (req, res) => {
  items.addToBookshelf(req, res, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      if (data.length === 0) {
        res.end('Book is already a part of bookcase');
      } else {
        res.end('Successfully added book to bookshelf');
      }
    }
  })
});

app.delete('/books', (req, res) => {
  items.removeFromBookshelf(req, res, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send('Removed book from bookshelf');
    }
  })
})

app.listen(3000, function() {
  console.log('listening on port 3000!');
});