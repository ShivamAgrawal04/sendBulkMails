import express from "express";
import {
  loginUser,
  logoutUser,
  profileUser,
  refreshToken,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/refresh", refreshToken);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/profile", verifyToken, profileUser);
router.post("/update", verifyToken, updateUser);

export default router;
