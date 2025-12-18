import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Subemails from "../models/subEmails.js";
import fs from "fs/promises"; // File system promises version
import nodemailer from "nodemailer";

export const sendEmail = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const data = req.body;

  const user = await User.findById(id);
  const emails = await Subemails.findById(id);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shivamagrawal0455@gmail.com",
      pass: GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${companyName}" <${gmailID}>`,
    to: "learncoding0455@gmail.com",
    subject: "Hello",
    text: "This is a test email",
    html: "<b>This is a test email</b>",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
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

  // Frontend se ab humein single 'email' chahiye, array nahi
  const { groupName, email } = req.body;

  if (!groupName || !email) {
    throw new ApiError(400, "Group name and email address are required");
  }

  const emailToAdd = email.toLowerCase().trim();

  // 1. Check karo group exist karta hai ya nahi
  let group = await Subemails.findOne({ user: userId, name: groupName });

  if (!group) {
    // --- CASE A: Group Nahi Hai (Create New) ---
    // Naya group banao aur usme yeh pehla email daal do
    group = await Subemails.create({
      user: userId,
      name: groupName,
      emails: [emailToAdd], // Array mein pehla item
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          group,
          `Group '${groupName}' created and email added.`
        )
      );
  } else {
    // --- CASE B: Group Exists (Add Single Email) ---

    // 1. Check Duplicate: Kya yeh email pehle se hai?
    if (group.emails.includes(emailToAdd)) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, group, "Email already exists in this group.")
        );
    }

    // 2. Check Limit: Kya 500 ki limit poori ho gayi hai?
    if (group.emails.length >= 500) {
      throw new ApiError(
        400,
        `Group '${groupName}' is full (500/500). Please create a new group.`
      );
    }

    // 3. Add Email: Agar jagah hai aur duplicate nahi hai, toh add karo
    group = await Subemails.findByIdAndUpdate(
      group._id,
      { $push: { emails: emailToAdd } }, // $push use kar sakte hain kyunki upar duplicate check kar liya hai
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, group, "Email added successfully."));
  }
});

export const addbulkEmails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { groupName } = req.body; // Ab group name chahiye

  // 1. Basic Validation
  if (!req.file) {
    throw new ApiError(400, "CSV/Text file is required");
  }

  if (!groupName) {
    // File delete karni padegi agar validation fail hua
    await fs.unlink(req.file.path).catch(() => {});
    throw new ApiError(400, "Group name is required");
  }

  const filePath = req.file.path;

  try {
    // 2. File Read & Parse
    const fileData = await fs.readFile(filePath, "utf8");

    // Regex to extract emails
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = fileData.match(emailPattern);

    if (!matches || matches.length === 0) {
      throw new ApiError(400, "No valid emails found in the file");
    }

    // 3. Clean & Deduplicate (File level pe)
    const uniqueEmailsFromFile = [
      ...new Set(matches.map((email) => email.toLowerCase())),
    ];

    // 4. Database Logic
    let group = await Subemails.findOne({ user: userId, name: groupName });

    if (!group) {
      // --- CASE A: Create New Group ---

      // Check Limit: Kya file mein 500 se zyada hain?
      if (uniqueEmailsFromFile.length > 500) {
        throw new ApiError(
          400,
          `File contains ${uniqueEmailsFromFile.length} emails. Max limit per group is 500. Please split your file.`
        );
      }

      group = await Subemails.create({
        user: userId,
        name: groupName,
        emails: uniqueEmailsFromFile,
      });
    } else {
      // --- CASE B: Add to Existing Group ---

      // Check Limit Logic:
      // Hum sirf wo count karenge jo DB mein pehle se nahi hain (Duplicates ignore)
      const currentEmailsSet = new Set(group.emails);

      // Filter out emails that are ALREADY in the DB
      const trulyNewEmails = uniqueEmailsFromFile.filter(
        (e) => !currentEmailsSet.has(e)
      );

      if (trulyNewEmails.length === 0) {
        // Agar saare emails pehle se the
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              group,
              "All emails in file already exist in this group."
            )
          );
      }

      // Calculate future total
      const totalAfterAdd = group.emails.length + trulyNewEmails.length;

      if (totalAfterAdd > 500) {
        const spaceLeft = 500 - group.emails.length;
        throw new ApiError(
          400,
          `Cannot add these emails. Group has ${group.emails.length} emails. You are trying to add ${trulyNewEmails.length} new ones. Only ${spaceLeft} spots left.`
        );
      }

      // Update DB
      group = await Subemails.findOneAndUpdate(
        { _id: group._id },
        { $addToSet: { emails: { $each: trulyNewEmails } } },
        { new: true }
      );
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          groupName: group.name,
          totalEmailsInGroup: group.emails.length,
          uploadedCount: uniqueEmailsFromFile.length,
        },
        "Emails uploaded successfully"
      )
    );
  } catch (error) {
    // Agar ApiError hai toh waisa hi phenko, nahi toh 500
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error processing file: " + error.message);
  } finally {
    // 5. Cleanup: Always delete temp file
    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.log("Error deleting temp file:", e);
    }
  }
});
