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

app.get('/favorites', function (req, res) {
  items.selectAllFromFavorites(function(err, data) {
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

app.post('/favorites', (req, res) => {
  items.addToFavorites(req, res, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      if (data.length === 0) {
        res.end('Book is already a part of favorites');
      } else {
        res.end('Successfully added book to favorites');
      }
    }
  })
});

app.delete('/books', (req, res) => {
  items.removeFromFavorites(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    items.removeFromBookshelf(req, res, (err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.end();
      }
    });
  });
})

app.delete('/favorites', (req, res) => {
  items.removeFromFavorites(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
})

app.listen(3000, function() {
  console.log('listening on port 3000!');
});