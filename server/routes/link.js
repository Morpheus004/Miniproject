import express from "express";
import db from "../config/database.js";

const router = express.Router();

router.put('/api/:user_id', async (req, res) => {
  const { user_id } = req.params.user_id;
  const { github,linkedIn,instagram,X} = req.body.updatedUserInfo;
  console.log(req.body);

  try {
    const { rows } = await db.query(
      'UPDATE users SET github = $1, linkedin = $2, instagram = $3 , X=$4 WHERE uid = $5 RETURNING *',
      [github, linkedIn, instagram, X,user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Edited data not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

export default router;