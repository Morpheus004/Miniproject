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


  router.get("/api/allapplied/:iid", async (req, res) => {
    const id=req.params.iid;
      try {
        const { rows } = await db.query("SELECT * FROM apply JOIN student ON apply.sid_fk=student.sid JOIN users ON student.uid=users.uid where apply.iid_fk=$1",[id]);
        console.log(rows);
        res.json(rows);
      } catch (error) {
        console.error("Error fetching applied students:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    });
  
    router.put("/api/internshipapplications/:internshipId", async (req, res) => {
      try {
        const internshipId = req.params.internshipId;
        const acceptance = req.body.acceptance; // true for accepting, false for cancelling
        const sid=req.body.sid;
    
        // Update the acceptance status of the event in the database
        const updatedInternship = await db.query("UPDATE apply set acceptance=$1 where iid_fk=$2 and sid_fk=$3",[acceptance,internshipId,sid]);
    
        // Send response
        res.json(updatedInternship);
      } catch (error) {
        console.error("Error accepting/cancelling application:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    router.get('/api/student/application/:iid', async (req, res) => {
      const iid = req.params.iid;
      const sid = req.query.sid;
      
      try {
        const { rows } = await db.query('SELECT * FROM apply WHERE iid_fk = $1 AND sid_fk = $2', [iid, sid]);
    
        if (rows.length > 0) {
          res.json({ acceptance: rows[0].acceptance });
        } else {
          res.status(404).json({ message: 'Application status not found' });
        }
      } catch (error) {
        console.error('Error fetching student application status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  export default router;