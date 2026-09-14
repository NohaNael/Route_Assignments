import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { CONSTANTS } from "../config/constants";

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = [...CONSTANTS.ALLOWED_IMAGE_MIME_TYPES, ...CONSTANTS.ALLOWED_PDF_MIME_TYPES, ...CONSTANTS.ALLOWED_LEGAL_ATTACHMENT_MIME_TYPES];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Unsupported file type"));
};

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!CONSTANTS.ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

export const uploadPdf = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!CONSTANTS.ALLOWED_PDF_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("Only PDF files are allowed"));
      return;
    }
    cb(null, true);
  },
});

export const uploadLegalAttachment = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!CONSTANTS.ALLOWED_LEGAL_ATTACHMENT_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("Only PDF or image files are allowed"));
      return;
    }
    cb(null, true);
  },
});
