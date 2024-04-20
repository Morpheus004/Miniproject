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
    const {sid}=req.body;
    try {
      // Check if user has already applied for the internship
    const existingApplication = await db.query("SELECT * FROM apply WHERE iid_fk = $1 AND sid_fk = $2", [internshipId, sid]);
    if (existingApplication.rows.length > 0) {
      console.log("user has already applied for the internship");
      return res.status(400).json({ error: "user has already applied for the internship" });
    }

    // If user is not registered, update registeredStudents count and add entry in register table
    console.log("Received request to apply for internship with ID:", internshipId);
    const result = await db.query("UPDATE internship SET applications = applications + 1 WHERE iid = $1", [internshipId]);
    await db.query("INSERT INTO apply (iid_fk, sid_fk) VALUES ($1, $2)", [internshipId, sid]);
    console.log("Database update result:", result);
    res.sendStatus(200);
    } catch (error) {
      console.error("Error applying for internship:", error);
      res.status(500).send('Error applying for internship');
    }
  });
  
  export default router;