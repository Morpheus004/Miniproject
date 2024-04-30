import express from "express";
import db from "../config/database.js";

const router = express.Router();

router.get("/student/:email", async (req, res) => {
  const userEmail = req.params.email;
  try {
    const { rows } = await db.query(
      "SELECT users.uid,username,email,role,sid,users.github,users.linkedin,instagram,X FROM users JOIN student ON student.uid = users.uid WHERE users.email = $1",
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
      "SELECT users.uid,username,email,role,aid,users.github,users.linkedin,instagram,X FROM users JOIN alumnus ON alumnus.uid = users.uid WHERE users.email = $1",
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

router.get("/alumni/aid/:aid", async (req, res) => {
  const aid = req.params.aid;
  console.log(aid);
  try {
    const { rows } = await db.query(
      "SELECT users.uid,username,email,role,aid FROM users JOIN alumnus ON alumnus.uid = users.uid WHERE alumnus.aid = $1",
      [aid]
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


router.get("/student/sid/:sid", async (req, res) => {
  const sid = req.params.sid;
  try {
    const { rows } = await db.query(
      "SELECT users.uid,username,email,role,sid FROM users JOIN student ON student.uid = users.uid WHERE student.sid = $1",
      [sid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching student information:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
