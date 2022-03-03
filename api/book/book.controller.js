const bookService = require('./book.service.js');
const logger = require('../../services/logger.service');

// GET LIST books
async function getBooks(req, res) {
  try {
    const books = await bookService.query();
    res.json(books);
  } catch (err) {
    logger.error('Failed to get books', err);
    res.status(500).send({ err: 'Failed to get books' });
  }
}

// GET book BY ID
async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const book = await bookService.getById(id);
    res.json(book);
  } catch (err) {
    logger.error(`Failed to get book ${id}`, err);
    res.status(500).send({ err: 'Failed to get book' });
  }
}

// POST (add book)
async function addBook(req, res) {
  try {
    const bookToAdd = req.body;
    const addedBook = await bookService.add(bookToAdd);
    res.json(addedBook);
  } catch (err) {
    logger.error('Failed to add book', err);
    res.status(500).send({ err: 'Failed to add book' });
  }
}

// PUT (Update book)
async function updateBook(req, res) {
  try {
    const bookToUpdate = req.body;
    const updatedBook = await bookService.update(bookToUpdate);
    res.json(updatedBook);
  } catch (err) {
    logger.error('Failed to update book', err);
    res.status(500).send({ err: 'Failed to update book' });
  }
}

// DELETE book
async function remove(req, res) {
  try {
    const { id } = req.params;
    const removedId = await bookService.remove(id);
    res.send(removedId);
  } catch (err) {
    logger.error('Failed to remove book', err);
    res.status(500).send({ err: 'Failed to remove book' });
  }
}

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  remove,
};
