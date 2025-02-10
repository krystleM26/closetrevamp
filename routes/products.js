const express = require('express');
const { pool } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.products');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    const { name, description, price, stock_quantity } = req.body;

    // Input validation (Example - expand as needed)
    if (!name || typeof name !== 'string' || name.length > 255) {
        return res.status(400).send('Invalid product name.');
    }
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).send('Invalid price.');
    }
    // ... validate other fields similarly ...

    try {
        const result = await pool.query(
            'INSERT INTO public.products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, stock_quantity]
        );
        res.status(201).json(result.rows[0]); // 201 Created
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // Example: Unique constraint violation
            res.status(400).send('Product with that name already exists.');
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = router;