import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from 'express-session';
import passport from './config/googleAuth.js';
import validateJSONToken from './util/auth.js';
import createJSONToken from './util/auth.js';
import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";
import eventsRoute from "./routes/event.js";
import internshipsRoute from "./routes/internship.js";
import alumniinternshipRoute from "./routes/alumniinternship.js";
import dataRoute from "./routes/data.js";
import registerRoute from "./routes/register.js";
import applyRoute from "./routes/apply.js";
import manageeventsRoute from "./routes/manageevents.js";
import fileuploadsRoute from "./routes/fileuploads.js";
import linksRoute from "./routes/link.js";
import completeRegistrationRoute from "./routes/completeRegistration.js";
import friendsRoute from "./routes/friends.js";
import chatRoute from "./routes/chat.js"
import { createGoogleToken } from './util/auth.js';
import { Server } from "socket.io";


const app = express();
const port = 9000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'mysupersecretkey',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header found.' });
  }

  try {
      // Check if it starts with 'Bearer '
      if (!authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Invalid token format.' });
      }

      // Extract the token
      const token = authHeader.split(' ')[1];
      
      if (!token) {
          return res.status(401).json({ error: 'No token provided.' });
      }
    const decoded = validateJSONToken(token);
    console.log("This is decoded",decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
      try {
        const userData = req.user;

        if (userData.isNewUser) {
          // For new users, redirect to role selection page with email
          const redirectUrl = new URL('http://localhost:3000/role-selection');
          redirectUrl.searchParams.set('email', userData.email);
          redirectUrl.searchParams.set('name', userData.username);
          return res.redirect(redirectUrl.toString());
        }
          
         // For existing users, create JWT and redirect to appropriate dashboard
      const token = await createGoogleToken(userData);
      const redirectUrl = new URL('http://localhost:3000/oauth-callback');
      redirectUrl.searchParams.set('token', token);
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('http://localhost:3000/login?error=' + encodeURIComponent(error.message));
    }
  }
);

const server=app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const io = new Server(server, {
  cors: {
      origin: "http://localhost:5173", // Your frontend URL
      methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their room`);
  });
  
  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});

global.io = io; // Make io accessible in routes

// Existing routes
app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use("/event", eventsRoute);
app.use("/internship",internshipsRoute);
app.use("/alumniinternship",alumniinternshipRoute);
app.use("/data",authMiddleware,dataRoute);
app.use("/register",registerRoute);
app.use("/apply",applyRoute);
app.use("/manageevents",manageeventsRoute);
app.use("/file",fileuploadsRoute);
app.use("/links",linksRoute);
app.use("/complete-registration", completeRegistrationRoute);
app.use("/friends", friendsRoute);
app.use("/chat",chatRoute)

