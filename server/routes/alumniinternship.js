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

  router.get("/api/username/:iid", async (req, res) => {
    const iid = req.params.iid;
    try {
      const { rows } = await db.query(
        "SELECT * FROM internship JOIN alumnus ON internship.aid_fk = alumnus.aid JOIN users ON alumnus.uid = users.uid WHERE iid = $1",
        [iid]
      );
      console.log(rows);
      if (rows.length > 0) {
        res.json({ username: rows[0].username });
      } else {
        res.status(404).json({ error: "Username not found for the specified internship ID" });
      }
    } catch (error) {
      console.error("Error fetching alumni username:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  
router.post("/api/alumni/internship", async (req, res) => {
    const { title,role,domain,applicants, date, location, description,duration,aid } = req.body;
    try {
      const { rows } = await db.query(
        "INSERT INTO internship (title,roles,domain_t,applications, date, location, description,duration_months,aid_fk) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) RETURNING *;",
        [title,role,domain,0, date, location, description,duration,aid]
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

router.get("/api/alumni/:aid", async (req, res) => {
  const aid=req.params.aid;
    try {
      const { rows } = await db.query("SELECT * FROM alumnus JOIN users ON alumus.uid=users.uid where aid=$1",[aid]);
      console.log(rows);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching username:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  export default router;