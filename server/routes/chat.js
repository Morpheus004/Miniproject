// routes/chat.js
import express from "express";
import db from "../config/database.js";
import { Server } from "socket.io";

const router = express.Router();

// Get or create conversation ID
const getConversationId = async (user1Id, user2Id) => {
    // Always use smaller ID first to ensure consistency
    const [smallerId, largerId] = [user1Id, user2Id].sort();
    
    try {
        // Check if conversation exists
        const { rows } = await db.query(
            `SELECT conversation_id FROM conversations 
             WHERE (user1_id = $1 AND user2_id = $2)`,
            [smallerId, largerId]
        );

        if (rows.length > 0) {
            return rows[0].conversation_id;
        }

        // Create new conversation
        const conversationId = `conv_${smallerId}_${largerId}`;
        await db.query(
            `INSERT INTO conversations (conversation_id, user1_id, user2_id)
             VALUES ($1, $2, $3)`,
            [conversationId, smallerId, largerId]
        );

        return conversationId;
    } catch (error) {
        console.error("Error in getConversationId:", error);
        throw error;
    }
};

// Get conversations list for a user
router.get("/conversations/:userId", async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const { rows } = await db.query(
            `SELECT 
                c.conversation_id,
                CASE 
                    WHEN c.user1_id = $1 THEN u2.username
                    ELSE u1.username
                END as other_user_name,
                CASE 
                    WHEN c.user1_id = $1 THEN u2.uid
                    ELSE u1.uid
                END as other_user_id,
                m.content as last_message,
                m.sent_at as last_message_time,
                COUNT(CASE WHEN m2.read_at IS NULL AND m2.sender_id != $1 THEN 1 END) as unread_count
             FROM conversations c
             JOIN users u1 ON c.user1_id = u1.uid
             JOIN users u2 ON c.user2_id = u2.uid
             LEFT JOIN messages m ON m.message_id = (
                SELECT message_id 
                FROM messages 
                WHERE conversation_id = c.conversation_id 
                ORDER BY sent_at DESC 
                LIMIT 1
             )
             LEFT JOIN messages m2 ON m2.conversation_id = c.conversation_id
             WHERE c.user1_id = $1 OR c.user2_id = $1
             GROUP BY c.conversation_id, u1.username, u2.username, u1.uid, u2.uid, m.content, m.sent_at
             ORDER BY COALESCE(m.sent_at, c.last_message_at) DESC`,
            [userId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Get messages for a conversation
router.get("/messages/:userId/:otherUserId", async (req, res) => {
    const { userId, otherUserId } = req.params;
    
    try {
        const conversationId = await getConversationId(userId, otherUserId);
        
        const { rows } = await db.query(
            `SELECT 
                m.*,
                u.username as sender_name
             FROM messages m
             JOIN users u ON m.sender_id = u.uid
             WHERE m.conversation_id = $1
             ORDER BY m.sent_at ASC`,
            [conversationId]
        );
        
        // Mark messages as read
        await db.query(
            `UPDATE messages 
             SET read_at = CURRENT_TIMESTAMP
             WHERE conversation_id = $1 
             AND receiver_id = $2 
             AND read_at IS NULL`,
            [conversationId, userId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Send a message
router.post("/message", async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    
    try {
        const conversationId = await getConversationId(senderId, receiverId);
        
        const { rows } = await db.query(
            `INSERT INTO messages 
             (conversation_id, sender_id, receiver_id, content)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [conversationId, senderId, receiverId, content]
        );

        // Update last_message_at in conversations
        await db.query(
            `UPDATE conversations 
             SET last_message_at = CURRENT_TIMESTAMP
             WHERE conversation_id = $1`,
            [conversationId]
        );
        
        // Emit socket event for real-time updates
        if (global.io) {
            global.io.to(receiverId.toString()).emit('new_message', {
                ...rows[0],
                sender_name: req.user.username // Assuming you have user info in req
            });
        }
        
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

  
router.delete('/conversation', async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        await db.query('BEGIN');
        
        // Delete messages first
        await db.query(
            `DELETE FROM messages 
             WHERE conversation_id IN (
                 SELECT conversation_id 
                 FROM conversations 
                 WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
             )`,
            [userId, friendId]
        );

        // Then delete conversation
        await db.query(
            `DELETE FROM conversations 
             WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
            [userId, friendId]
        );

        await db.query('COMMIT');
        res.json({ success: true });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete messages for a conversation
router.delete('/messages', async (req, res) => {
  const { conversationId } = req.body;

  if (!conversationId) {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  try {
    await db.query('BEGIN');

    // Check if the conversation exists
    const { rows: conversationRows } = await db.query(
      'SELECT 1 FROM conversations WHERE conversation_id = $1',
      [conversationId]
    );

    if (conversationRows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Delete the messages
    await db.query(
      'DELETE FROM messages WHERE conversation_id = $1',
      [conversationId]
    );

    // Update the last_message_at timestamp
    await db.query(
      'UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE conversation_id = $1',
      [conversationId]
    );

    await db.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error clearing messages:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
