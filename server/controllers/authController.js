const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");
require("dotenv").config({path: "../.env"});

//register controller
exports.register = async (req, res) => {
  
 try {const {full_name, email, password, role } = req.body;

let finalRole = role || "user";

if (!req.user) {
  // No token → allow creating default user
  if (role && role !== "user") {
    return res.status(403).json({ message: "Only admin can assign roles" });
  }
  finalRole = "user"; // force user role
} else if (req.user.role !== "admin" && role && role !== "user") {
  return res.status(403).json({ message: "Only admin can assign roles" });
}
//fetch role by name
const existingRole = await Role.findOne({ where: { name: finalRole } });
if (!existingRole) return res.status(400).json({ message: "Invalid role" });


  const hashed = await bcrypt.hash(password, 10);
  await User.create({full_name, email, password: hashed,  role_id: existingRole.id });
  
  res.status(201).json({ message: "User registered" });}

  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};



//login controller

exports.login = async (req, res) => {
 try{ 
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email },include: Role });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id, role: user.Role.name }, process.env.JWT_SECRET,  { expiresIn: "1d" });
  res.status(200).json({ token ,
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.Role.name,
    },
  });}

  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
