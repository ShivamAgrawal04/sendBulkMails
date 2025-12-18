import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  addbulkEmails,
  addSingleEmail,
  showsubEmails,
} from "../controllers/sendemailController.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/showsubEmails", verifyToken, showsubEmails);
router.get("/addsubEmail", verifyToken, addSingleEmail);
router.get(
  "/uploadEmails",
  verifyToken,
  upload.single("myFile"),
  addbulkEmails
);

export default router;
