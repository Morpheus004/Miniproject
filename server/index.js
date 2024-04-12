import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";
import eventsRoute from "./routes/event.js";
import internshipsRoute from "./routes/internship.js"

const app = express();
const port = 9000;
// const saltRounds=10;
// env.config();


app.use(cors());
app.use(bodyParser.json());

// Mounting signup and login routes
app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use("/event", eventsRoute);
app.use("/internship",internshipsRoute);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
