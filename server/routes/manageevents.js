import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();

router.get("/api/requests/:aid", async (req, res) => {
    const aid = req.params.aid;
    try {
      const { rows } = await db.query("SELECT * FROM manageevents join student ON manageevents.sid_fk=student.sid join events ON manageevents.eid_fk=events.eid where manageevents.aid_fk=$1",[aid]);
      console.log(rows);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

router.post("api/requests/:aid",async (req, res) => {
    const aid = req.params.aid;
    const {eid,sid}=req.body;
    try {
      const { rows } = await db.query(
        "INSERT INTO manageevents (sid_fk,eid_fk,aid_fk) VALUES ($1, $2, $3) RETURNING *;",
        [sid,eid,aid]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error adding manageeventsrows:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
})

export default router;