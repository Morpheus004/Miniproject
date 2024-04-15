import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();
const saltRounds = 10;

router.post("/", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
      console.log("Email already exists. Try logging in.");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const result = await db.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [username, email, hash]
          );
          console.log(result);
          res.sendStatus(200);
          console.log("Successfully inserted into database");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
