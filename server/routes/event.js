import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();

router.get("/api/events", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM events");
      console.log(rows);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  
router.post("/api/events", async (req, res) => {
    const { title, date, location, description, seats } = req.body;
    try {
      const { rows } = await db.query(
        "INSERT INTO events (title, date, description, seats) VALUES ($1, $2, $3, $4) RETURNING *;",
        [title, date, description, seats]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error adding event:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  
router.delete("/api/events/:id", async (req, res) => {
    const eventId = req.params.id;
    try {
      await db.query("DELETE FROM events WHERE eid = $1", [eventId]);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  export default router;