const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController.js");
const { verifyToken, onlyRole } = require("../middlewares/authMiddleware.js");

//admin :get all users
router.get("/", verifyToken, onlyRole("admin"), ctrl.getAllUsers);
// //admin :create user
// router.post("/", verifyToken, onlyRole("admin"), ctrl.createUser);
// Any logged-in user: Get own profile
router.get("/me", verifyToken, ctrl.getMyProfile);
//admin or poweruser on user req :update user
router.put("/:id", verifyToken, onlyRole("admin", "powerUser"), ctrl.updateUser);
//admin :delete user
router.delete("/:id", verifyToken, onlyRole("admin"), ctrl.deleteUser);

module.exports = router;
