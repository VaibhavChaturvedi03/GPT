import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect:'https://gpt-pi-beige.vercel.app/'
    }),
    (req, res) => {
        res.redirect('https://gpt-pi-beige.vercel.app/');
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
