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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


