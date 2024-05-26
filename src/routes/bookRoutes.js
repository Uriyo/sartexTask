const express = require('express');
const { addBooks, getBooks, getBookById, updateBook, deleteBook, upload } = require('../controllers/bookController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/upload', authenticate, authorize(['SELLER']), upload.single('file'), addBooks);
router.get('/', authenticate, getBooks);
router.get('/:id', authenticate, getBookById);
router.put('/:id', authenticate, authorize(['SELLER']), updateBook);
router.delete('/:id', authenticate, authorize(['SELLER']), deleteBook);

module.exports = router;
