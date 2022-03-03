const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');

async function query() {
  try {
    const query = 'SELECT * FROM book';
    let books = await dbService.runSQL(query);
    return books;
  } catch (err) {
    logger.error('cannot find books', err);
    throw err;
  }
}

async function getById(bookId) {
  try {
    const query = 'SELECT * FROM book WHERE book.id = ?';
    const book = await dbService.runSqlEscape(query, [bookId]);
    return book;
  } catch (err) {
    logger.error(`while finding book: ${bookId}`, err);
    throw err;
  }
}

async function remove(bookId) {
  try {
    const query = `DELETE FROM book WHERE book.id = ?`;
    await dbService.runSqlEscape(query, [bookId]);
    return bookId;
  } catch (err) {
    logger.error(`cannot remove book ${bookId}`, err);
    throw err;
  }
}

async function add({title,price,genre,publication_date,author}) {
  try {
    const query = `INSERT INTO book (Title,Price,Genre,Publication_date,Author) VALUES (?,?,?)`;
    const addedBook = await dbService.runSqlEscape(query, [title,price,genre,publication_date,author]);
    return addedBook
  } catch (err) {
    logger.error('cannot insert book', err);
    throw err;
  }
}

async function update({id, title, isPublic}) {
  try {
    const query = `UPDATE book SET  title = ?, isPublic = ? WHERE book.id = ?`;
    await dbService.runSqlEscape(query, [title, isPublic, id]);
    return {id, title, isPublic};
  } catch (err) {
    logger.error(`cannot update book ${id}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};
