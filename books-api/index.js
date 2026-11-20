const express = require('express');
const app = express();
const PORT = 3000;


app.use(express.json());

let books = [];
let nextId = 1;


app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;


  if (!title || !author || year === undefined) {
    return res.status(400).json({ error: 'Missing required fields: title, author, and year are required.' });
  }

  const isDuplicate = books.some(
    (b) => b.title.toLowerCase() === title.trim().toLowerCase()
  );
  if (isDuplicate) {
    return res.status(409).json({ error: 'A book with this title already exists.' });
  }

  const newBook = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    year: Number(year),
  };

  books.push(newBook);


  res.status(201).json(newBook);
});

app.get('/api/books', (req, res) => {
  const { author } = req.query;

  if (author) {
    const filteredBooks = books.filter(
      (b) => b.author.toLowerCase() === author.trim().toLowerCase()
    );
    return res.status(200).json(filteredBooks);
  }

  res.status(200).json(books);
});


app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((b) => b.id === id);


  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  res.status(200).json(book);
});


app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((b) => b.id === id);


  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const { title, author, year } = req.body;


  if (!title || !author || year === undefined) {
    return res.status(400).json({ error: 'Missing required fields: title, author, and year are required.' });
  }

  const isDuplicate = books.some(
    (b) => b.id !== id && b.title.toLowerCase() === title.trim().toLowerCase()
  );
  if (isDuplicate) {
    return res.status(409).json({ error: 'Another book with this title already exists.' });
  }

  book.title = title.trim();
  book.author = author.trim();
  book.year = Number(year);

  res.status(200).json(book);
});

app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const deletedBook = books.splice(index, 1)[0];
  res.status(200).json({ message: 'Book deleted successfully.', book: deletedBook });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});