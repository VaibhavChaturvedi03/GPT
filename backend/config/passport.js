import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, 
      passReqToCallback: false
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile || !profile.id) {
          return done(new Error("Invalid Google profile"), null);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        const picture =
          profile.photos && profile.photos.length > 0
            ? profile.photos[0].value
            : null;

        user = await User.create({
          googleId: profile.id,
          email,
          name: profile.displayName || "Google User",
          picture
        });

        return done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || null);
  } catch (err) {
    console.error("Deserialize user error:", err);
    done(err, null);
  }
});

export default passport;
