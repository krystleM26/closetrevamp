const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

// Optionally, test the connection
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
        const query = {
            text: 'SELECT * FROM public.products', // Or public.products if needed
            // ... any other query parameters (e.g., values for placeholders)
        };

        console.log("Executing query:", query.text); // <--- Debugging line

        const res = await pool.query('SELECT * FROM public.products');

        console.log("Products fetched:", res.rows); // Log the results

        return res.rows; // Return the products

    } catch (error) {
        console.error("Error fetching products:", error); // Keep this error logging
        if (error.hasOwnProperty('routine')) { // Check if the error has a routine property
            console.error("Postgres Error Routine:", error.routine); // Log the routine
        }
        throw error; // Re-throw the error to be handled by the caller
    }
}


// Example of how to use the getProducts function:
async function doSomething() {
    try {
        const products = await getProducts();
        console.log("Products in doSomething:", products);
        // ... do something with the products ...
    } catch (error) {
        console.error("Error in doSomething:", error); // Handle the error
    }
}

doSomething(); // Call the function to actually fetch the products.



module.exports = { pool, getProducts };