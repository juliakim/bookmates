const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'bookmates'
});

const escapeApostrophes = (string) => {
  return string.split('\'').join('\'\'');
}

const addToBookshelf = (req, res, callback) => {
  const { title, authors, publishedDate, description, pageCount, imageLinks, previewLink, ISBN13 } = req.body;

  // Search by title and author if ISBN13 is unavailable
  let checkBooksQuery;
  if (!ISBN13) {
    checkBooksQuery = `SELECT * FROM books WHERE title = '${escapeApostrophes(title)}' AND authors = '${authors}'`;
  } else {
    checkBooksQuery = `SELECT * FROM books WHERE isbn = ${ISBN13}`;
  }

  // Ensure book is not already in table of books
  connection.query(checkBooksQuery, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      // Add book to table if there are no matching rows
      if (results.length === 0) {
        const addBookQuery = `INSERT INTO books (title, authors, publishedDate, description, pageCount, imageLinks, previewLink, isbn) VALUES ('${escapeApostrophes(title)}', '${authors}', '${publishedDate}', '${escapeApostrophes(description)}', ${pageCount}, '${imageLinks}', '${previewLink}', '${ISBN13}')`;
        connection.query(addBookQuery, (err, results) => {
          if(err) {
            callback(err, null);
          } else {
            callback(null, results);
          }
        });
      } else {
        callback(null, []);
      }
    }
  });
}

const addToFavorites = (req, res, callback) => {
  const { title, authors, publishedDate, description, pageCount, imageLinks, previewLink, ISBN13 } = req.body;

  // Check if book exists in books table
  const checkBooksQuery = `SELECT * FROM books WHERE title = '${escapeApostrophes(title)}' AND authors = '${authors}'`;
  connection.query(checkBooksQuery, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      // Add book to books table
      if (results.length === 0) {
        const addBookQuery = `INSERT INTO books (title, authors, publishedDate, description, pageCount, imageLinks, previewLink, isbn) VALUES ('${escapeApostrophes(title)}', '${authors}', '${publishedDate}', '${escapeApostrophes(description)}', ${pageCount}, '${imageLinks}', '${previewLink}', '${ISBN13}')`;
        connection.query(addBookQuery, (err, results) => {
          if(err) {
            callback(err, null);
          } else {
            connection.query(checkBooksQuery, (err, results) => {
              if (err) {
                callback(err, null);
              } else {
                connection.query(`INSERT INTO favorites (book_id) VALUES (${results[0].id})`, (err, results) => {
                  if (err) {
                    callback(err, null);
                  } else {
                    callback(null, results);
                  }
                });
              }
            });
            callback(null, results);
          }
        });
      // Check if book exists in favorites table
      } else {
        // Add book to favorites table
        connection.query(checkBooksQuery, (err, results) => {
          if (err) {
            callback(err, null);
          } else {
            if (results.length === 0) {
              connection.query(`INSERT INTO favorites (book_id) VALUES (${results[0].id})`, (err, results) => {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, results);
                }
              });
            } else {
              callback(null, results);
            }
          }
        });
      }
    }
  });

  /*
  // Search by title and author if ISBN13 is unavailable
  let checkBooksQuery;
  if (!ISBN13) {
    checkBooksQuery = `SELECT * FROM books WHERE title = '${escapeApostrophes(title)}' AND authors = '${authors}'`;
  } else {
    checkBooksQuery = `SELECT * FROM books WHERE isbn = ${ISBN13}`;
  }

  // Ensure book is not already in table of books
  connection.query(checkBooksQuery, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      // Add book to table if there are no matching rows
      if (results.length === 0) {
        const addBookQuery = `INSERT INTO books (title, authors, publishedDate, description, pageCount, imageLinks, previewLink, isbn) VALUES ('${escapeApostrophes(title)}', '${authors}', '${publishedDate}', '${escapeApostrophes(description)}', ${pageCount}, '${imageLinks}', '${previewLink}', '${ISBN13}')`;
        connection.query(addBookQuery, (err, results) => {
          if (err) {
            callback(err, null);
          } else {
            // Add book to favorites if there are no matching rows
            const findBookId = `SELECT id FROM books WHERE title = '${title}' AND authors = '${authors}'`;
            connection.query(findBookId, (err, results) => {
              if (err) {
                callback(err, null);
              } else {
                // Add book to favorites if there are no matching rows
                if (results.length === 0) {
                  const addFavoriteQuery = `INSERT INTO favorites (book_id) VALUES (${results.id})`
                  console.log(addFavoriteQuery);
                  connection.query(addFavoriteQuery, (err, results) => {
                    if (err) {
                      callback(err, null);
                    } else {
                      callback(null, results);
                    }
                  });
                }
              }
            });
          }
        });
        // Book already in bookshelf
      } else {
        const findBookId = `SELECT id FROM books WHERE title = '${title}' AND authors = '${authors}'`;
        connection.query(findBookId, (err, results) => {
          if (err) {
            callback(err, null);
          } else {
            // Add book to favorites if there are no matching rows
            if (results.length === 0) {
              const addFavoriteQuery = `INSERT INTO favorites (book_id) VALUES (${results.id})`
              console.log(addFavoriteQuery);
              connection.query(addFavoriteQuery, (err, results) => {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, results);
                }
              });
            }
          }
        });
        callback(null, []);
      }
    }
  });
  */
}

const selectAllFromBookshelf = (callback) => {
  connection.query('SELECT * FROM books ORDER BY id DESC', function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const selectAllFromFavorites = (callback) => {
  // connection.query(`SELECT book_id FROM favorites`, (err, results) => {
  //   if (err) {
  //     callback(err, null);
  //   } else {
  //     const bookIds = [];
  //     results.forEach(result => bookIds.push(result.book_id));
  //     connection.query('SELECT * FROM books WHERE id IN (bookIds.join(',')) ORDER BY id DESC', function(err, results, fields) {
  //       if (err) {
  //         console.log(err);
  //         console.log(bookIds.join(','));
  //         callback(err, null);
  //       } else {
  //         console.log('success', results);
  //         callback(null, results);
  //       }
  //     });
  //   }
  // })
  connection.query(`SELECT books.* FROM books JOIN favorites ON books.id = favorites.book_id ORDER BY id DESC`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const removeFromBookshelf = (req, res, callback) => {
  connection.query(`DELETE FROM books WHERE id = ${req.body.id}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

const removeFromFavorites = (req, res, callback) => {
  connection.query(`SELECT * FROM favorites WHERE book_id = ${req.body.id}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {

        connection.query(`DELETE FROM favorites WHERE id = ${results[0].id}`, (err, results) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, results);
          }
        });
      }
      callback(null, results);
    }
  });
}

module.exports = { addToBookshelf, addToFavorites, selectAllFromBookshelf, selectAllFromFavorites, removeFromBookshelf, removeFromFavorites };