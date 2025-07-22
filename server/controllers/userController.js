const { User, Role } = require("../models");

// Admin: View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "full_name", "email", "role", "room_no", "location", "createdAt"],
      include: { model: Role, attributes: ["name"] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

//Logged-in user: View own profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "full_name", "email"],
      include: { model: Role, attributes: ["name"] },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

//Update user 
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      // powerUser can only update user on their request (i.e., own ID)
      if (req.user.role === "powerUser" && parseInt(req.user.id) !== parseInt(id)) {
        return res.status(403).json({ message: "Can only update user on request" });
      }

      // user can only update their own profile
      if (req.user.role === "user" && parseInt(req.user.id) !== parseInt(id)) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
