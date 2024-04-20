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
        "INSERT INTO events (title, date,location, description, seats,registeredStudents) VALUES ($1, $2, $3, $4,$5,0) RETURNING *;",
        [title, date,location, description, seats]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error adding event:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  
// router.delete("/api/events/:id", async (req, res) => {
//     const eventId = req.params.id;
//     try {
//       await db.query("DELETE FROM events WHERE eid = $1", [eventId]);
//       res.sendStatus(204);
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       res.status(500).json({ error: "An unexpected error occurred" });
//     }
//   });
  router.put("/api/events/:eventId/register", async (req, res) => {
    const eventId = req.params.eventId;
    const {sid} =req.body;
    try {
      // Check if user is already registered for the event
    const existingRegistration = await db.query("SELECT * FROM register WHERE eid_fk = $1 AND sid_fk = $2", [eventId, sid]);
    if (existingRegistration.rows.length > 0) {
      console.log("user is already registered for the event");
      return res.status(400).json({ error: "User is already registered for this event." });
    }

    // If user is not registered, update registeredStudents count and add entry in register table
    console.log("Received request to register for event with ID:", eventId);
    const result=await db.query("UPDATE events SET registeredstudents = registeredstudents + 1 WHERE eid = $1", [eventId]);
    await db.query("INSERT INTO register (eid_fk, sid_fk) VALUES ($1, $2)", [eventId, sid]);
    console.log("Database update result:", result);
    res.sendStatus(200);
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).send('Error registering for event');
    }
  });

  

  export default router;