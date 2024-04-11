import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM student WHERE email = $1 OR username = $2", [email, username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      // Verifying the password
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            console.log("Login successful");
            res.sendStatus(200);
          } else {
            res.send("Incorrect Password");
            console.log("Incorrect password");
          }
        }
      });
    } else {
      res.send("User not found");
      console.log("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
