import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();
//to get events where a particular alumni is invited
router.get("/api/requests/a/:aid", async (req, res) => {
    const aid = req.params.aid;
    try {
      const { rows } = await db.query('SELECT * FROM manageevents join student ON manageevents.sid_fk=student.sid join events ON manageevents.eid_fk=events.eid where manageevents.aid_fk=$1',[aid]);
      console.log(rows);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

//to get names of all alumni
router.get("/api/allalumni", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM alumnus join users ON alumnus.uid=users.uid");
    console.log(rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// to get all alumni to whom request has been sent for an event
router.get("/api/requests/e/:eid", async (req, res) => {
  const eid = req.params.eid;
  try {
    const { rows } = await db.query("SELECT * FROM manageevents join alumnus ON manageevents.aid_fk=alumnus.aid join events ON manageevents.eid_fk=events.eid where manageevents.eid_fk=$1",[eid]);
    console.log(rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

//post request for sending the invitations to the alumni
router.post("/api/requests/:eid",async (req, res) => {
    const eid = req.params.eid;
    const { alumniIds ,sid} = req.body;
    // const {eid,sid}=req.body;
    try {
      // const { rows } = await db.query(
      //   "INSERT INTO manageevents (sid_fk,eid_fk,aid_fk) VALUES ($1, $2, $3) RETURNING *;",
      //   [sid,eid,aid]
      // );
      // res.status(201).json(rows[0]);

      //way to perform multiple inserts
      // Insert a row for each selected alumni
        const queries = alumniIds.map((aid) =>
        db.query(
          "INSERT INTO manageevents (sid_fk, eid_fk, aid_fk) VALUES ($1, $2, $3)",
          [sid, eid, aid]
          )
        );

      await Promise.all(queries);
      console.log(queries);
      res.status(201).json({ message: "Invitations sent successfully" });
    } catch (error) {
      console.error("Error adding manageeventsrows:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
})

router.put("/api/requests/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const acceptance = req.body.acceptance; // true for accepting, false for cancelling
    const aid=req.body.aid;

    // Update the acceptance status of the event in the database
    const updatedEvent = await db.query("UPDATE manageevents set acceptance=$1 where eid_fk=$2 and aid_fk=$3",[acceptance,eventId,aid]);

    // Send response
    res.json(updatedEvent);
  } catch (error) {
    console.error("Error accepting/cancelling invitation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;