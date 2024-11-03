import pg from "pg";
import env from "dotenv";
env.config();
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT),
  });
  db.connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Port number is "+process.env.PG_PORT+"Error connecting to the database:", err));
export default db;
