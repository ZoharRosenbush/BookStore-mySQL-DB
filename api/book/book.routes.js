const express = require('express');

const {getBooks, getBookById, addBook, updateBook, remove} = require('./book.controller');
const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', addBook);
router.put('/:id', updateBook);
router.delete('/:id', remove);

module.exports = router;
