import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();

router.get("/api/userapplications", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM apply");
      console.log(rows);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  export default router;