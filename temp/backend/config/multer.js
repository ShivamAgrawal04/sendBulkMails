import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // File yahan save hogi temporarily
    // Make sure tumhare root folder mein 'public/temp' folder bana ho
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Hum file ka original naam hi rakhenge
    // (e.g., data.csv upload hua to data.csv hi save hoga)
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});
