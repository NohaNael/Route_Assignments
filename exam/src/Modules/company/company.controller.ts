import { Router, Request, Response } from "express";
import { CompanyService } from "./company.service";
import { successResponse } from "../../Utils/response/success.response";
import { asyncHandler } from "../../Middlewares/async-handler.middleware";
import { AppError } from "../../Utils/response/error.response";
import { validateDto } from "../../Middlewares/validation.middleware";
import { authenticate } from "../../Middlewares/auth.middleware";
import { uploadImage, uploadLegalAttachment } from "../../Middlewares/multer.middleware";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import jobcontroller from "../job/job.controller";

const companycontroller = Router();

companycontroller.use(authenticate); // every company route requires a logged-in user

companycontroller.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    const name = Array.isArray(req.query.name) ? req.query.name[0] : req.query.name;
    const companies = await CompanyService.searchByName(typeof name === "string" ? name : "");
    successResponse(res, 200, "Companies retrieved successfully", companies);
  })
);

companycontroller.post(
  "/",
  uploadLegalAttachment.single("legalAttachment"),
  validateDto(CreateCompanyDto),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("legalAttachment file is required", 422);
    const company = await CompanyService.createCompany(req.user!._id.toString(), req.body, req.file);
    successResponse(res, 201, "Company created successfully. Pending admin approval", company);
  })
);

companycontroller.patch(
  "/:companyId",
  validateDto(UpdateCompanyDto),
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const company = await CompanyService.updateCompany(companyId ?? "", req.user!, req.body);
    successResponse(res, 200, "Company updated successfully", company);
  })
);

companycontroller.delete(
  "/:companyId",
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const result = await CompanyService.softDeleteCompany(companyId ?? "", req.user!);
    successResponse(res, 200, "Company deleted successfully", result);
  })
);

companycontroller.get(
  "/:companyId",
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const company = await CompanyService.getCompanyWithJobs(companyId ?? "");
    successResponse(res, 200, "Company retrieved successfully", company);
  })
);

companycontroller.post(
  "/:companyId/logo",
  uploadImage.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("No file uploaded", 422);
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const media = await CompanyService.uploadLogo(companyId ?? "", req.user!, req.file);
    successResponse(res, 200, "Logo uploaded successfully", media);
  })
);

companycontroller.post(
  "/:companyId/cover-pic",
  uploadImage.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("No file uploaded", 422);
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const media = await CompanyService.uploadCoverPic(companyId ?? "", req.user!, req.file);
    successResponse(res, 200, "Cover picture uploaded successfully", media);
  })
);

companycontroller.delete(
  "/:companyId/logo",
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const result = await CompanyService.deleteLogo(companyId ?? "", req.user!);
    successResponse(res, 200, "Logo deleted successfully", result);
  })
);

companycontroller.delete(
  "/:companyId/cover-pic",
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const result = await CompanyService.deleteCoverPic(companyId ?? "", req.user!);
    successResponse(res, 200, "Cover picture deleted successfully", result);
  })
);

// Merge params so /companies/:companyId/jobs works (nested job routes)
companycontroller.use("/:companyId/jobs", jobcontroller);

export default companycontroller;
