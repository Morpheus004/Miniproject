import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();

router.get("/api/internships", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM internship");
      console.log(rows);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching internships:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  router.put("/api/internships/:internshipId", async (req, res) => {
    const internshipId = req.params.internshipId;
    try {
      console.log("Received request to apply for internship with ID:", internshipId);
      const result = await db.query("UPDATE internship SET applications = applications + 1 WHERE iid = $1", [internshipId]);
      console.log("Database update result:", result);
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).send('Error registering for event');
    }
  });
  
  export default router;