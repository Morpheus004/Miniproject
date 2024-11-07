// routes/friends.js
import express from "express";
import db from "../config/database.js";

const router = express.Router();

// Check if user exists by email
router.post("/check-user", async (req, res) => {
    const { email } = req.body;
    try {
        const { rows } = await db.query(
            "SELECT uid FROM users WHERE email = $1",
            [email.toLowerCase()]
        );
        res.json({ exists: rows.length > 0, uid: rows[0]?.uid });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Check if friend request exists
router.post("/check-friend-request", async (req, res) => {
    const { senderId, receiverId } = req.body;
    
    try {
        const { rows } = await db.query(
            `SELECT status FROM friend_requests 
             WHERE (sender_id = $1 AND receiver_id = $2)
             OR (sender_id = $2 AND receiver_id = $1)`,
            [senderId, receiverId]
        );
        
        if (rows.length > 0) {
            res.json({ exists: true, status: rows[0].status });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking friend request:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Send friend request
router.post("/send-friend-request", async (req, res) => {
    const { senderId, receiverId } = req.body;
    
    try {
        const { rows } = await db.query(
            `INSERT INTO friend_requests 
             (sender_id, receiver_id, status, request_date) 
             VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP)
             RETURNING *`,
            [senderId, receiverId]
        );
        
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Get all friend requests for a user
router.get("/requests/:userId", async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const { rows } = await db.query(
            `SELECT fr.*, 
             sender.username as sender_name,
             receiver.username as receiver_name,
             sender.uid as sender_id,
             receiver.uid as receiver_id,
             sender.email as sender_mail
             FROM friend_requests fr
             JOIN users sender ON fr.sender_id = sender.uid
             JOIN users receiver ON fr.receiver_id = receiver.uid
             WHERE (receiver_id = $1 OR sender_id = $1)
             AND status = 'pending'
             ORDER BY request_date DESC`,
            [userId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Accept/Reject friend request
router.put("/request/:senderId/:receiverId", async (req, res) => {
    const { senderId, receiverId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    
    try {
        const { rows } = await db.query(
            `UPDATE friend_requests 
             SET status = $1, 
             updated_date = CURRENT_TIMESTAMP
             WHERE sender_id = $2 AND receiver_id = $3
             RETURNING *`,
            [status, senderId, receiverId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Friend request not found" });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error("Error updating friend request:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Get all friends for a user
router.get("/list/:userId", async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const { rows } = await db.query(
            `SELECT 
             CASE 
                WHEN fr.sender_id = $1 THEN receiver.username
                ELSE sender.username
             END as friend_name,
             CASE 
                WHEN fr.sender_id = $1 THEN receiver.uid
                ELSE sender.uid
             END as friend_id,
             CASE 
                WHEN fr.sender_id = $1 THEN receiver.email
                ELSE sender.email
             END as friend_email
             FROM friend_requests fr
             JOIN users sender ON fr.sender_id = sender.uid
             JOIN users receiver ON fr.receiver_id = receiver.uid
             WHERE (sender_id = $1 OR receiver_id = $1)
             AND status = 'accepted'`,
            [userId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error("Error fetching friends list:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Delete friend relationship
router.delete('/remove', async (req, res) => {
    const { userId, friendId } = req.body;
    try {
      await db.query(
        'DELETE FROM friend_requests WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)',
        [userId, friendId]
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
 
export default router;