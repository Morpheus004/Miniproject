import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();

router.get("/api/profile/:email",async(req,res)=>{
    const userEmail=req.params.email;
    try{
        const {rows}=await db.query("SELECT * FROM users join student where student.uid=users.uid");
        if (!rows) {
            return res.status(404).json({ message: "User not found" });
          }
          res.json(user);
        } catch (error) {
          console.error("Error fetching user information:", error);
          res.status(500).json({ message: "Server error" });
        }
    }
)
export default router;