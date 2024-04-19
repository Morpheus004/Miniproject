import express from "express";
import db from "../config/database.js";

const router = express.Router();

router.get("/student/:email", async (req, res) => {
  const userEmail = req.params.email;
  try {
    const { rows } = await db.query(
      "SELECT users.uid,username,email,role,sid FROM users JOIN student ON student.uid = users.uid WHERE users.email = $1",
      [userEmail]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/alumni/:email", async (req, res) => {
  const userEmail = req.params.email;
  try {
    const { rows } = await db.query(
      "SELECT users.uid,username,email,role,aid FROM users JOIN alumnus ON alumnus.uid = users.uid WHERE users.email = $1",
      [userEmail]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;