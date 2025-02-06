require('dotenv').config();
const express = require('express');
const cors = require('cors');
const wardrobeRoutes = require('./routes/wardrobe');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/wardrobe', wardrobeRoutes)
app.get('/', (req, res) => {
    res.send('Fashion API is running...');
})

// Get all products
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Product not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new product
app.post("/products", async (req, res) => {
  try {
    const { name, description, price, stock_quantity } = req.body;
    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, stock_quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


