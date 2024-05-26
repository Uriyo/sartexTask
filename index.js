const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
