import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();
const isProduction = process.env.NODE_ENV === 'production';
const frontendURL = isProduction ? 'https://gpt-pi-beige.vercel.app' : 'http://localhost:5173';

router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: frontendURL,
        session: true
    }),
    (req, res) => {
        // After successful authentication, redirect to frontend
        // The session cookie should now be set
        res.redirect(`${frontendURL}/?authenticated=true`);
    }
);

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

router.get('/current-user', (req, res) => {
    if (req.user) {
        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                picture: req.user.picture
            }
        });
    } else {
        res.status(401).json({ user: null });
    }
});

export default router;
