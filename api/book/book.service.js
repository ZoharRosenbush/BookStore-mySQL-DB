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
    const books = await dbService.runSqlEscape(query, [bookId]);
    if (books.length === 1) return books[0];
    throw new Error(`book ${bookId} not found`);
  } catch (err) {
    logger.error(`while finding book: ${bookId}`, err);
    throw err;
  }
}

async function remove(bookId) {
  try {
    const query = `DELETE FROM book WHERE book.id = ?`;
    const okPacket = await dbService.runSqlEscape(query, [bookId]);
    if (okPacket.affectedRows === 1) return bookId;
    return bookId;
    throw new Error(`Book ${bookId} was not removed`);
  } catch (err) {
    logger.error(`cannot remove book ${bookId}`, err);
    throw err;
  }
}

async function add({ title, price, genre, publication_date, author }) {
  try {
    const query = `INSERT INTO book (Title,Price,Genre,Publication_date,Author) VALUES (?,?,?,?,?)`;
    const { insertId } = await dbService.runSqlEscape(query, [title, price, genre, publication_date, author]);
    const addedBook = { id: insertId, title, price, genre, publication_date, author }
    return addedBook
  } catch (err) {
    logger.error('cannot insert book', err);
    throw err;
  }
}

async function update({ id, title, price, genre, publication_date, author }) {
  try {
    const query = `UPDATE book SET Title = ?, Price = ?, Genre = ?, Publication_date = ?, Author = ? WHERE book.id = ?`;
    const okPacket = await dbService.runSqlEscape(query, [title, price, genre, publication_date, author, id]);
    if (okPacket.affectedRows !== 0) return { id, title, price, genre, publication_date, author }
    throw new Error(`Book ${id} was not updated`);
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
