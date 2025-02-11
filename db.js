const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

// Product DB
pool.connect()
  .then(client => {
    console.log('Connected to the database');
    return client.query('SELECT current_database()');
  })
  .then(res => {
    console.log('Connected to database:', res.rows[0].current_database);
  })
  .catch(err => console.error('Error connecting to the database', err));

  async function getProducts() {  // <--- Example function to get products
    try {
        // const query = {
        //     text: 'SELECT * FROM public.products', // Or public.products if needed
        //     // ... any other query parameters (e.g., values for placeholders)
        // };

        // console.log("Executing query:", query.text); // <--- Debugging line

        const res = await pool.query('SELECT * FROM public.products');
        return res.rows; // Return the products

    } catch (error) {
       console.error('Error fetching products', error);
       throw error;
    }
}


// User DB
async function findUserByAuth0Id(auth0Id) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE auth0_id = $1', [auth0Id]);
    return res.rows[0]; // Returns undefined if no user is found
  } catch (error) {
    console.error("Error finding user by Auth0 ID:", error);
    throw error;
  }
}

async function createUser(user) {
  try {
    const res = await pool.query(
      'INSERT INTO users (auth0_id, email, name) VALUES ($1, $2, $3) RETURNING *',
      [user.auth0Id, user.email, user.name]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function findUserById(id) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}

module.exports = { pool, getProducts, findUserByAuth0Id, createUser, findUserById };




