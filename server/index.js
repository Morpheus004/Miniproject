import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";

const app = express();
const port = 9000;
const saltRounds=10;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(cors());
app.use(bodyParser.json());
// var pratham=[]
// app.get("/signup",(req,res)=>{
//   res.send(pratham);
// })
app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username=req.body.username;
  console.log(req.body); //not necessary remove
  try {
    const checkResult = await db.query("SELECT * FROM student WHERE email = $1", [
      email,
    ]);
    const checkResult_u=await db.query("SELECT * FROM student WHERE username = $1", [
      username,
    ]);// to prevent same usernames to exist
    if (checkResult.rows.length > 0) {
      // res.send("Email already exists. Try logging in.");
      res.send({
        message:"Email already exists. Try logging in.",
      });
      console.log("Email already exists. Try logging in.");
    } else if(checkResult_u.rows.length > 0){
      res.send({
        message:"Username already exists.Try another name",
      })
      console.log("Username already exists.Try another name");
    } else {
      bcrypt.hash(password,saltRounds,async(err,hash)=>{
        if (err){
          console.log(err);
        }else{
        const result = await db.query(
        "INSERT INTO student (username,email, password) VALUES ($1, $2, $3)",
        [username,email, hash]
      );
      console.log(result);
      res.send({
        message:"successfully inserted into database",
      });
      // res.sendStatus(200);
      console.log("successfully inserted into database");
        }
    })
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const username = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM student WHERE email = $1 OR username=$2", [
      email,username
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      //verifying the password
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            console.log("Login succesful")
            res.send({
              message:"Login succesful",
            });
          } else {
            // res.send("Incorrect Password");
            res.send({
              message:"Incorrect password",
            });
            console.log("incorrect password");
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });