import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

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


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  