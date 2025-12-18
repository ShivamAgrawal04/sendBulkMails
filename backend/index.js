import express from "express";
import "dotenv/config";
// import transporter from "./config/nodemailer.js";
import connectToDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import emailRoutes from "./routes/emailRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    // vercel deploy url
    // Frontend ka EXACT URL (wildcard '*' mat use karna)
    credentials: true, // YEH SABSE ZAROORI HAI
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/email", emailRoutes);

const port = process.env.PORT;
if (!port) console.log("PORT is not defined in environment variables");

app.listen(port, (req, res) => {
  connectToDB();
  console.log(`server starred on http://localhost:${port}`);
});

// module.exports = app;
