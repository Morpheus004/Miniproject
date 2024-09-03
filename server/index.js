import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import validateJSONToken from './util/auth.js'

import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";
import eventsRoute from "./routes/event.js";
import internshipsRoute from "./routes/internship.js"
import alumniinternshipRoute from "./routes/alumniinternship.js"
import dataRoute from "./routes/data.js";
import registerRoute from "./routes/register.js"
import applyRoute from "./routes/apply.js"
import manageeventsRoute from "./routes/manageevents.js"
import fileuploadsRoute from "./routes/fileuploads.js"
import linksRoute from "./routes/link.js"

const app = express();
const port = 9000;
// const saltRounds=10;
// env.config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  console.log(token);
  
  try {
  
    const decoded = validateJSONToken(token);
    console.log("This is decoded",decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mounting signup and login routes
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
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
