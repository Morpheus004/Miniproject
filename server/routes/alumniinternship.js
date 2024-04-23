import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();

router.get("/api/alumni/internship", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM internship");
      console.log(rows);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching internships:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  
router.post("/api/alumni/internship", async (req, res) => {
    const { title,role,domain,applicants, date, location, description,duration } = req.body;
    try {
      const { rows } = await db.query(
        "INSERT INTO internship (title,roles,domain_t,applications, date, location, description,duration_months) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *;",
        [title,role,domain,0, date, location, description,duration]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error adding internship:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  
router.delete("/api/alumni/internship/:id", async (req, res) => {
    const eventId = req.params.id;
    try {
      await db.query("DELETE FROM internship WHERE iid = $1", [eventId]);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting internship:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  export default router;