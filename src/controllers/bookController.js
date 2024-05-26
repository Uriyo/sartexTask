const pool = require('../utils/db');
const csvParser = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const addBooks = async (req, res) => {
    const file = req.file;
    const books = [];
  
    fs.createReadStream(file.path)
      .pipe(
        csvParser({
          mapHeaders: ({ header }) => header.trim(),
        })
      )
      .on("data", (data) => {
        console.log("Raw data from CSV:", data); // Log raw data
        // Validate data and only push valid rows (ignoring publishedDate)
        const title = data["title"];
        const author = data["author"];
        const price = data["price"];

        if (title && author && price && !isNaN(parseFloat(price))) {
          books.push([title, author, parseFloat(price), req.user.id]);
          console.log("Valid data added:", { title, author, price }); // Log valid data
        } else {
          console.warn("Invalid data skipped:", { title, author, price });
        }
      })
      .on("end", async () => {
        try {
          if (books.length > 0) {
            console.log("Books to insert:", books);

            // Use a single bulk insert query with multiple sets of values
            const placeholders = books.map(() => "(?, ?, ?, ?)").join(", ");
            const values = books.flat();

            const query = `INSERT INTO books (title, author, price, seller_id) VALUES ${placeholders}`;
            await pool.query(query, values);

            res.status(201).json({ message: "Books added successfully" });
          } else {
            res.status(400).json({ error: "No valid books to add" });
          }
        } catch (error) {
          console.error("Error adding books:", error);
          res.status(400).json({ error: "Error adding books" });
        }
      });
  };
const getBooks = async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM books');
  res.json(rows);
};

const getBookById = async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [parseInt(req.params.id)]);
  if (rows.length > 0) {
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
};

const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, price } = req.body;
  
    // Validate input parameters
    if (!id || !title || !author || !price) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
  
    try {
      const [rows] = await pool.execute('SELECT * FROM books WHERE id = ? AND seller_id = ?', [id, req.user.id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Book not found or unauthorized' });
      }
  
      const updateFields = [];
      const updateValues = [];
  
      if (title) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }
      if (author) {
        updateFields.push('author = ?');
        updateValues.push(author);
      }
      if (price) {
        updateFields.push('price = ?');
        updateValues.push(parseFloat(price));
      }
  
      updateValues.push(id);
      updateValues.push(req.user.id);
  
      const query = `UPDATE books SET ${updateFields.join(', ')} WHERE id = ? AND seller_id = ?`;
      await pool.execute(query, updateValues);
  
      res.json({ message: 'Book updated successfully' });
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: 'An error occurred while updating the book' });
    }
  };

const deleteBook = async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.execute('SELECT * FROM books WHERE id = ? AND seller_id = ?', [parseInt(id), req.user.id]);
  if (rows.length > 0) {
    await pool.execute('DELETE FROM books WHERE id = ?', [parseInt(id)]);
    res.json({ message: 'Book deleted' });
  } else {
    res.status(404).json({ error: 'Book not found or unauthorized' });
  }
};

module.exports = { addBooks, getBooks, getBookById, updateBook, deleteBook, upload };
