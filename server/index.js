import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import pg from "pg";

const app = express();
const port = 9000;
// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "world",
//   password: "",
//   port: 5432,
// });
// db.connect();
app.use(cors());
app.use(bodyParser.json());
var pratham=[]
app.get("/signup",(req,res)=>{
  res.send(pratham);
})
app.post("/signup", (req, res) => {
  console.log("Signup request received!"); // Log for debugging (optional)
  console.log(req.body);
  pratham.push(req.body)
  res.sendStatus(200); // Send success status code
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  