const express = require('express');
const { pool } = require('../db'); // Destructure pool from the imported module
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.products'); // <--- Add public.
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST a new product
router.post('/', async (req, res) => {
    console.log('POST request received');
    try {
        const { name, description, price, stock_quantity } = req.body;
        const result = await pool.query(
            'INSERT INTO public.products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *', // <--- Add public.
            [name, description, price, stock_quantity]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;