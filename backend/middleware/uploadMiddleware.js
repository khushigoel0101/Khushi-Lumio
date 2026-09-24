import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "text/plain",
  "text/markdown",
  "application/json",
  "application/xml",
  "text/csv",
  "application/pdf",
  "application/msword", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedExtensions = [".txt", ".md", ".json", ".xml", ".csv",".pdf",
  ".doc", ".docx",];

const fileFilter = (req, file, cb) => {
  const originalName = file.originalname.toLowerCase();

  const hasAllowedExtension = allowedExtensions.some((ext) =>
    originalName.endsWith(ext)
  );

  const hasAllowedMimeType = allowedMimeTypes.includes(file.mimetype);

  if (hasAllowedExtension && hasAllowedMimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only text-based files are allowed (.txt, .md, .json, .xml, .csv)."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});

export const uploadSingleTextFile = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File is too large. Maximum allowed size is 2 MB.",
        });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};