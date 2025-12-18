import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userEmail, password } = req.body;
  if (!fullName || !userEmail || !password)
    throw new ApiError(400, "Some fields are missing");

  const userExist = await User.findOne({ userEmail });
  if (userExist) throw new ApiError(409, "User Already exists");

  const user = await User.create({
    fullName,
    userEmail,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User Registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { userEmail, password } = req.body;

  if (!userEmail || !password)
    throw new ApiError(400, "Email and password are required");

  const userExist = await User.findOne({ userEmail });

  if (!userExist) throw new ApiError(404, "User doesn't exists");

  const accessToken = jwt.sign(
    { id: userExist._id, role: userExist.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: userExist._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userExist, accessToken },
        "User Login Successfully"
      )
    );
});

export const profileUser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user fetched successfully"));
});

// export const refreshToken = asyncHandler((req, res) => {
//   const token = req.cookies.refreshToken;

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);

//     const newAccessToken = jwt.sign(
//       { id: user.id },
//       process.env.ACCESS_SECRET,
//       { expiresIn: "15m" }
//     );

//     res.json({ accessToken: newAccessToken });
//   });
// });

export const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // 1. Purana Token Verify karo
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_SECRET
    );

    const user = await User.findById(decodedToken?.id);
    if (!user) throw new ApiError(401, "Invalid refresh token");

    // 2. --- NEW LOGIC: Generate BOTH Tokens (Rotation) ---
    // Access Token (Short lived: 15m)
    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // Refresh Token (Long lived: 7d) - Isse user ka session extend hota rahega
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 3. Cookie Options (Security ke liye)
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Sirf https pe chalega production mein
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-site issues ke liye
    };

    // 4. Response Bhejo
    return (
      res
        .status(200)
        // Naya Refresh Token Cookie mein set karo
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              accessToken: newAccessToken,
              user, // <--- YEH MOST IMPORTANT HAI (Frontend recovery ke liye)
            },
            "Access token refreshed successfully"
          )
        )
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(new ApiResponse(200, {}, "Logged out"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { emailAccounts } = req.body;
  console.log(req.body);

  if (!Array.isArray(emailAccounts) || emailAccounts.length === 0) {
    return res.status(400).json({ message: "emailAccounts is required" });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { emailAccounts },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});
