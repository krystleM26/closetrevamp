const express = require('express');
const router = express.Router();
const passport = require('../oauthServer');

router.get('/login', passport.authenticate('auth0'));

router.get(
    '/callback',
    passport.authenticate('auth0', { failureRedirect: '/login' }), // Redirect on failure
    (req, res) => {
        res.redirect('/dashboard'); // Or wherever you want to redirect after login
    }
);

router.get('/logout', (req, res) => {
    req.logout(); // Clear the session
    res.redirect(process.env.AUTH0_LOGOUT_URL || '/'); // Redirect to Auth0 logout or home
});

module.exports = router;