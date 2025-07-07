import { admins } from "./admins.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = admins.find((a) => a.username === username);
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { username: admin.username },
      process.env.JWT_SECRET || "your_jwt_secret", // replace with env var
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      username: admin.username,
      role: "admin",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
