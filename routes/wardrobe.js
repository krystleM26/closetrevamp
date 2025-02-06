const express = require('express');
const pool = require('../db')
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Wardrobe route is working!')
})

//Add a clothing item
router.post('/', async(req, res) => {
    try {
        const {user_id, item_name, category, color, image_url } = req.body;
        const newItem = await pool.query(
            'INSERT INTO wardrobe (user_id, item_name, category, color, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, item_name, category, color, image_url]
        );
        res.json(newItem.rows[0]);
     } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        }
    
})

module.exports = router