import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/**
 * GET /api/chat/conversations
 * Get all conversations for current user
 */
router.get("/conversations", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const query = `
      WITH last_messages AS (
        SELECT DISTINCT ON (conversation_id) 
          conversation_id,
          content,
          created_at,
          is_official
        FROM messages
        ORDER BY conversation_id, created_at DESC
      )
      SELECT 
        c.id,
        c.user1_id,
        c.user2_id,
        c.is_official,
        CASE 
          WHEN c.user1_id = $1 THEN u2.id
          WHEN c.user2_id = $1 THEN u1.id
          ELSE NULL
        END as other_user_id,
        CASE 
          WHEN c.user1_id = $1 THEN u2.name
          WHEN c.user2_id = $1 THEN u1.name
          ELSE 'Official Messages'
        END as name,
        CASE 
          WHEN c.user1_id = $1 THEN u2.avatar_url
          WHEN c.user2_id = $1 THEN u1.avatar_url
          ELSE '/uploads/avatars/official.png'
        END as avatar,
        lm.content as last_message,
        lm.created_at as last_message_time,
        lm.is_official as is_official_message,
        COALESCE(
          (SELECT COUNT(*) FROM messages m 
           WHERE m.conversation_id = c.id 
           AND m.is_read = false 
           AND m.sender_id != $1), 
          0
        ) as unread_count
      FROM conversations c
      LEFT JOIN users u1 ON c.user1_id = u1.id
      LEFT JOIN users u2 ON c.user2_id = u2.id
      LEFT JOIN last_messages lm ON c.id = lm.conversation_id
      WHERE c.user1_id = $1 OR c.user2_id = $1 OR c.is_official = true
      ORDER BY c.updated_at DESC, lm.created_at DESC NULLS LAST
    `;

    const result = await client.query(query, [req.userId]);

    res.json({
      success: true,
      conversations: result.rows.map(row => ({
        id: row.id,
        userId: row.other_user_id,
        name: row.name,
        avatar: row.avatar,
        lastMessage: row.last_message || "Tidak ada pesan",
        time: row.last_message_time,
        unread: row.unread_count,
        isOfficial: row.is_official
      }))
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * GET /api/chat/messages/:conversationId
 * Get all messages in a conversation
 */
router.get("/messages/:conversationId", verifyToken, async (req, res) => {
  const { conversationId } = req.params;
  const client = await pool.connect();
  
  try {
    // Check if user is part of this conversation
    const convCheck = await client.query(
      `SELECT id FROM conversations 
       WHERE id = $1 
         AND (user1_id = $2 OR user2_id = $2 OR is_official = true)`,
      [conversationId, req.userId]
    );

    if (convCheck.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied to this conversation" 
      });
    }

    // Mark messages as read
    await client.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE conversation_id = $1 AND sender_id != $2`,
      [conversationId, req.userId]
    );

    // Get messages
    const result = await client.query(
      `SELECT 
        m.id,
        m.sender_id,
        m.content,
        m.created_at,
        m.is_official,
        u.name as sender_name,
        u.avatar_url as sender_avatar
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC`,
      [conversationId]
    );

    res.json({
      success: true,
      messages: result.rows.map(row => ({
        id: row.id,
        senderId: row.sender_id,
        content: row.content,
        time: row.created_at,
        fromMe: row.sender_id === req.userId,
        isOfficial: row.is_official,
        senderName: row.sender_name,
        senderAvatar: row.sender_avatar
      }))
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * POST /api/chat/send
 * Send a message
 */
router.post("/send", verifyToken, async (req, res) => {
  const { recipientId, content } = req.body;
  const client = await pool.connect();

  try {
    // Validate input
    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Message content is required" 
      });
    }

    if (!recipientId) {
      return res.status(400).json({ 
        success: false, 
        message: "Recipient ID is required" 
      });
    }

    // Prevent sending to self
    if (recipientId === req.userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot send message to yourself" 
      });
    }

    // Validate recipient exists
    const recipientCheck = await client.query(
      `SELECT id FROM users WHERE id = $1`,
      [recipientId]
    );

    if (recipientCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Recipient not found" 
      });
    }

    await client.query("BEGIN");

    // Find or create conversation
    let conversationResult = await client.query(
      `SELECT id FROM conversations 
       WHERE (user1_id = $1 AND user2_id = $2) 
          OR (user1_id = $2 AND user2_id = $1)`,
      [req.userId, recipientId]
    );

    let conversationId;
    if (conversationResult.rows.length === 0) {
      // Create new conversation (ensure user1_id < user2_id for uniqueness)
      const [user1, user2] = req.userId < recipientId 
        ? [req.userId, recipientId] 
        : [recipientId, req.userId];
      
      const newConv = await client.query(
        `INSERT INTO conversations (user1_id, user2_id, created_at, updated_at) 
         VALUES ($1, $2, NOW(), NOW()) 
         RETURNING id`,
        [user1, user2]
      );
      conversationId = newConv.rows[0].id;
    } else {
      conversationId = conversationResult.rows[0].id;
      // Update conversation timestamp
      await client.query(
        `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
        [conversationId]
      );
    }

    // Insert message
    const messageResult = await client.query(
      `INSERT INTO messages 
       (conversation_id, sender_id, content, created_at, is_read, is_official) 
       VALUES ($1, $2, $3, NOW(), false, false) 
       RETURNING id, created_at`,
      [conversationId, req.userId, content]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: {
        id: messageResult.rows[0].id,
        conversationId,
        senderId: req.userId,
        content,
        time: messageResult.rows[0].created_at,
        fromMe: true
      }
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * GET /api/chat/official
 * Get official messages for current user
 */
router.get("/official", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    // Get or create official conversation
    let convResult = await client.query(
      `SELECT id FROM conversations WHERE is_official = true LIMIT 1`
    );

    let conversationId;
    if (convResult.rows.length === 0) {
      const newConv = await client.query(
        `INSERT INTO conversations (is_official, created_at) 
         VALUES (true, NOW()) 
         RETURNING id`
      );
      conversationId = newConv.rows[0].id;
    } else {
      conversationId = convResult.rows[0].id;
    }

    // Get official messages for this user
    const result = await client.query(
      `SELECT 
        id,
        content,
        created_at,
        message_type
      FROM messages
      WHERE conversation_id = $1 
        AND (is_official = true)
        AND (sender_id IS NULL OR sender_id = $2)
      ORDER BY created_at DESC
      LIMIT 50`,
      [conversationId, req.userId]
    );

    res.json({
      success: true,
      messages: result.rows.map(row => ({
        id: row.id,
        content: row.content,
        time: row.created_at,
        type: row.message_type
      }))
    });
  } catch (error) {
    console.error("Error fetching official messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * POST /api/chat/official/send
 * Send official message (system notification)
 * REMOVED - Use sendOfficialNotification() function for server-side notifications only
 * This endpoint was a security risk as it allowed any client to send fake system messages
 */

/**
 * Helper function to send official notification
 * Can be imported and used by other routes
 * SERVER-SIDE ONLY - not exposed to public API
 */
export async function sendOfficialNotification(userId, content, messageType = "notification") {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let convResult = await client.query(
      `SELECT id FROM conversations WHERE is_official = true LIMIT 1`
    );

    let conversationId;
    if (convResult.rows.length === 0) {
      const newConv = await client.query(
        `INSERT INTO conversations (is_official, created_at, updated_at) 
         VALUES (true, NOW(), NOW()) 
         RETURNING id`
      );
      conversationId = newConv.rows[0].id;
    } else {
      conversationId = convResult.rows[0].id;
      // Update conversation timestamp
      await client.query(
        `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
        [conversationId]
      );
    }

    // Insert official message with NULL sender_id (system message)
    await client.query(
      `INSERT INTO messages 
       (conversation_id, sender_id, content, created_at, is_read, is_official, message_type) 
       VALUES ($1, NULL, $2, NOW(), false, true, $3)`,
      [conversationId, content, messageType]
    );

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error sending official notification:", error);
    return false;
  } finally {
    client.release();
  }
}

export default router;
