import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from "../config/database.js";
import 'dotenv/config'

// console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
// console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET);
passport.use(new GoogleStrategy({
    // clientID: process.env.GOOGLE_CLIENT_ID,
    // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientID: "1004589852320-4g2iq868u1cqr16qn8bk7m5nsm3tjhfs.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: process.env.BACKEND_URL+"/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [profile.emails[0].value]
      );

      if (existingUser.rows.length > 0) {
        // User exists, return user data
        return done(null, existingUser.rows[0]);
      }
      const newUser = await db.query(
        'INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *',
        [profile.emails[0].value, profile.displayName]
      );

      return done(null, { ...newUser.rows[0], isNewUser: true });
    } catch (error) {
      return done(error, null);
    }
  }
)
);

passport.serializeUser((user, done) => {
  done(null, user.uid);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE uid = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

export default passport;