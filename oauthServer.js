require('dotenv').config();
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const db = require('./db'); 

console.log("Auth0 Domain:", process.env.AUTH0_DOMAIN);
console.log("Auth0 Client ID:", process.env.AUTH0_CLIENT_ID);
console.log("Auth0 Client Secret:", process.env.AUTH0_CLIENT_SECRET);
console.log("Auth0 Callback URL:", process.env.AUTH0_CALLBACK_URL);
console.log("Session Secret (part):", process.env.SESSION_SECRET.substring(0, 10)); // Log a part of the session secret


const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
    scope: 'openid email profile' // Request user profile and email
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await db.findUserByAuth0Id(profile.id);

      if (!user) {
        user = await db.createUser({
          auth0Id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName || profile.name.givenName + ' ' + profile.name.familyName, // Access name
          // Add other profile data as needed
        });
      }

      return done(null, user); 
    } catch (error) {
      return done(error);
    }
  }
);


passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by database ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;