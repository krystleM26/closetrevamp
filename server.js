require('dotenv').config();  // This loads environment variables
const express = require('express');
const path = require('path')
const session = require('express-session')
const passport = require('./oauthServer.js');
const authRoutes = require('./routes/authRoutes')
const pool = require('./db');
const cors = require('cors');
const wardrobeRoutes = require('./routes/products'); // Import the product routes

const app = express();

console.log("Server starting..."); // Add logging
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Your secret key for session encryption (VERY IMPORTANT!)
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: { secure: false } // Set to 'true' in production with HTTPS
  })
);

console.log("Session middleware added.")
app.use(passport.initialize()); // Initializes Passport.js middleware
app.use(passport.session()); // Enables persistent login sessions (uses the session middleware)
console.log("Passport.js middleware added.")

app.use('/auth', authRoutes); // Mounts the authentication routes under the /auth path
console.log("Auth routes mounted.");


// Use the product routes
app.use('/api/products', wardrobeRoutes); 

// Error-handling middleware

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { // Passport.js adds this method to req
    return next(); // User is authenticated, proceed to the next middleware/route handler
  }
  res.redirect('/auth/login'); // User is not authenticated, redirect to Auth0 login
}

// Example protected route
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send('Welcome to the dashboard, ' + (req.user ? req.user.name : 'Guest') + '!'); // Access user info from req.user
});

// Error-handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
