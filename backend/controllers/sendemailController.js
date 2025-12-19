import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Subemails from "../models/subEmails.js";
import fs from "fs/promises"; // File system promises version
import nodemailer from "nodemailer";

export const sendEmail = asyncHandler(async (req, res) => {
  const id = req.user.id; // req.user mein sirf id hai
  const { from, to, bcc, subject, text, html } = req.body;
  console.log(req.body);

  // Ek baar DB call kiya, poora user object mil gaya
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 1. ISI 'user' object se account calculate kar lo (No extra DB call)
  const account = user.emailAccounts.find((acc) => acc.email === from);

  if (!account) {
    return res.status(404).json({ message: "Sender account not linked!" });
  }

  // 2. Setup Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: account.email,
      pass: account.googleAppPassword,
    },
  });

  // 3. Mail Options (Sahi logic: Individual to 'to', Group to 'bcc')
  const mailOptions = {
    from: `"${user.fullName}" <${from}>`,
    to: to || undefined,
    bcc: bcc || undefined,
    subject: subject,
    text: text,
    html: html || text,
  };

  console.log(mailOptions);

  // 4. Send with Async/Await
  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("Nodemailer Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export const showsubEmails = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const subemails = await Subemails.findOne({ user: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, subemails, "fetched successfully"));
});

export const addSingleEmail = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  let { groupName, email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");
  groupName = groupName?.trim() || "General";
  const lowerEmail = email.toLowerCase();

  // 1. User ka document dhoondo ya naya banao
  let userDoc = await Subemails.findOne({ user: userId });
  if (!userDoc) {
    userDoc = await Subemails.create({ user: userId, groups: [] });
  }

  // 2. Global Unique Check (Kahin bhi ye email hai?)
  const emailExists = userDoc.groups.some((g) => g.emails.includes(lowerEmail));
  if (emailExists)
    throw new ApiError(400, "Email already exists in one of your groups!");

  // 3. Total Emails Limit (Max 1000)
  const totalEmails = userDoc.groups.reduce(
    (acc, g) => acc + g.emails.length,
    0
  );
  if (totalEmails >= 1000)
    throw new ApiError(400, "Total 1000 emails limit reached!");

  // 4. Target Group dhoondo
  let targetGroup = userDoc.groups.find(
    (g) => g.groupName.toLowerCase() === groupName.toLowerCase()
  );

  if (!targetGroup) {
    // Max 5 Groups Check
    if (userDoc.groups.length >= 5)
      throw new ApiError(400, "Maximum 5 groups allowed!");

    // Naya group add karo array mein
    userDoc.groups.push({ groupName, emails: [lowerEmail] });
  } else {
    // Existing group mein check (Max 500)
    if (targetGroup.emails.length >= 500)
      throw new ApiError(400, "Group limit of 500 reached!");
    targetGroup.emails.push(lowerEmail);
  }

  await userDoc.save();
  res.status(200).json({ success: true, message: "Email added successfully" });
});

export const addbulkEmails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  let { groupName } = req.body;
  if (!req.file) throw new ApiError(400, "File is required");
  groupName = groupName?.trim() || "General";

  const filePath = req.file.path;
  try {
    const fileData = await fs.readFile(filePath, "utf8");
    const matches =
      fileData.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const uniqueFileEmails = [...new Set(matches.map((e) => e.toLowerCase()))];

    if (uniqueFileEmails.length > 500)
      throw new ApiError(400, "File exceeds 500 emails limit.");

    // 1. User Doc Fetch
    let userDoc = await Subemails.findOne({ user: userId });
    if (!userDoc)
      userDoc = await Subemails.create({ user: userId, groups: [] });

    // 2. Global Duplicate & Total Count Check
    const allExistingEmails = new Set(userDoc.groups.flatMap((g) => g.emails));
    const trulyNewEmails = uniqueFileEmails.filter(
      (e) => !allExistingEmails.has(e)
    );

    const totalCurrentCount = userDoc.groups.reduce(
      (acc, g) => acc + g.emails.length,
      0
    );
    if (totalCurrentCount + trulyNewEmails.length > 1000) {
      throw new ApiError(
        400,
        "Adding these would exceed the 1000 total email limit."
      );
    }

    // 3. Target Group Logic
    let targetGroup = userDoc.groups.find(
      (g) => g.groupName.toLowerCase() === groupName.toLowerCase()
    );

    if (!targetGroup) {
      if (userDoc.groups.length >= 5)
        throw new ApiError(400, "Max 5 groups limit reached.");
      userDoc.groups.push({ groupName, emails: trulyNewEmails });
    } else {
      if (targetGroup.emails.length + trulyNewEmails.length > 500) {
        throw new ApiError(
          400,
          `Not enough space in group "${groupName}". Max 500 allowed.`
        );
      }
      targetGroup.emails.push(...trulyNewEmails);
    }

    await userDoc.save();
    res.status(200).json({ success: true, message: "Bulk upload successful" });
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
});
