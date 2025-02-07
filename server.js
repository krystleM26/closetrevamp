require('dotenv').config();  // This loads environment variables
const express = require('express');
const pool = require('./db');
const cors = require('cors');
const wardrobeRoutes = require('./routes/products'); // Import the product routes

const app = express();
app.use(cors());
app.use(express.json());

// Use the product routes
app.use('/api/products', wardrobeRoutes); 

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
