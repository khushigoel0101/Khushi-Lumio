import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "text/plain",
  "text/markdown",
  "application/json",
  "application/xml",
  "text/csv",
];

const allowedExtensions = [".txt", ".md", ".json", ".xml", ".csv"];

const fileFilter = (req, file, cb) => {
  const originalName = file.originalname.toLowerCase();

  const hasAllowedExtension = allowedExtensions.some((ext) =>
    originalName.endsWith(ext)
  );

  const hasAllowedMimeType = allowedMimeTypes.includes(file.mimetype);

  if (hasAllowedExtension || hasAllowedMimeType) {
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

export const uploadSingleTextFile = upload.single("file");