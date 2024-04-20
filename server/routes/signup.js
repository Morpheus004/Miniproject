import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";
import {createJSONToken} from "../util/auth.js";

const router = express.Router();
const saltRounds = 10;

router.post("/", async (req, res) => {
  const { email, password, username ,role} = req.body;

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
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
            [username, email, hash, role]
          );
          // console.log(role);
          const uidGenerated=await db.query(
            "SELECT uid from users where email=($1)",[email]
          );
          const uid = uidGenerated.rows[0].uid;
          // console.log(uid);
          let table;
          if (role === 'student') {
            table = 'student';
          } else if (role === 'alumni') {
            table = 'alumnus';
          }

          // Insert user into corresponding role table (students or alumni)
         if(table){
          const roleInsertResult = await db.query(
              `INSERT INTO ${table} (uid) VALUES ($1)`,
              [uid]
            );
            console.log(roleInsertResult);
          }
          const user={
            email:email,
            role:role,
          };
          const authToken=createJSONToken(user);
          console.log(result);
          res.status(201).json({ message: 'User created.', user: user, token: authToken });
          console.log("Successfully inserted into database");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
