export const CONSTANTS = {
  MIN_AGE_YEARS: 18,
  OTP_LENGTH: 6,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 200,
  AUTH_RATE_LIMIT_MAX_REQUESTS: 20, // stricter limit for auth endpoints
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  CRON_OTP_CLEANUP_SCHEDULE: "0 */6 * * *", // every 6 hours
  ALLOWED_IMAGE_MIME_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  ALLOWED_PDF_MIME_TYPES: ["application/pdf"],
  ALLOWED_LEGAL_ATTACHMENT_MIME_TYPES: ["application/pdf", "image/png", "image/jpeg", "image/jpg"],
  CLOUDINARY_FOLDERS: {
    PROFILE_PICS: "job-search-app/users/profile",
    COVER_PICS: "job-search-app/users/cover",
    COMPANY_LOGOS: "job-search-app/companies/logo",
    COMPANY_COVERS: "job-search-app/companies/cover",
    LEGAL_ATTACHMENTS: "job-search-app/companies/legal",
    CVS: "job-search-app/applications/cvs",
  },
};
