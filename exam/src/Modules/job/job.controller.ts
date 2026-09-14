import { Router, Request, Response, NextFunction } from "express";
import { JobService } from "./job.service";
import { successResponse } from "../../Utils/response/success.response";
import { asyncHandler } from "../../Middlewares/async-handler.middleware";
import { AppError } from "../../Utils/response/error.response";
import { validateDto } from "../../Middlewares/validation.middleware";
import { authenticate } from "../../Middlewares/auth.middleware";
import { authorize } from "../../Middlewares/authorization.middleware";
import { uploadPdf } from "../../Middlewares/multer.middleware";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobFilterDto } from "./dto/job-filter.dto";
import { UpdateApplicationStatusDto } from "../application/dto/update-status.dto";
import { Role, ApplicationStatus } from "../../types/enums";

// mergeParams lets this router read :companyId when mounted at /companies/:companyId/jobs
const jobcontroller = Router({ mergeParams: true });

jobcontroller.use(authenticate);

// GET / -> jobs for a specific company (when nested) OR all jobs with filters (when mounted at /jobs)
jobcontroller.get(
  "/",
  (req: Request, _res: Response, next: NextFunction) => {
    // Route to the right validation shape depending on whether we're nested under a company.
    if (req.params.companyId) return next();
    return validateDto(JobFilterDto, "query")(req, _res, next);
  },
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const companyName = Array.isArray(req.query.companyName) ? req.query.companyName[0] : req.query.companyName;
    if (companyId) {
      const result = await JobService.getJobsForCompany(companyId, typeof companyName === "string" ? companyName : undefined, req.query as never);
      return successResponse(res, 200, "Jobs retrieved successfully", result);
    }
    const result = await JobService.getFilteredJobs(req.query as never);
    successResponse(res, 200, "Jobs retrieved successfully", result);
  })
);

jobcontroller.post(
  "/",
  validateDto(CreateJobDto),
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const job = await JobService.createJob(companyId ?? "", req.user!, req.body);
    successResponse(res, 201, "Job created successfully", job);
  })
);

jobcontroller.patch(
  "/:jobId",
  validateDto(UpdateJobDto),
  asyncHandler(async (req: Request, res: Response) => {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const job = await JobService.applyUpdateJob(jobId ?? "", req.user!, req.body);
    successResponse(res, 200, "Job updated successfully", job);
  })
);

jobcontroller.delete(
  "/:jobId",
  asyncHandler(async (req: Request, res: Response) => {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const result = await JobService.deleteJob(jobId ?? "", req.user!);
    successResponse(res, 200, "Job deleted successfully", result);
  })
);

jobcontroller.get(
  "/:jobId/applications",
  asyncHandler(async (req: Request, res: Response) => {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const result = await JobService.getApplicationsForJob(jobId ?? "", req.user!, req.query as never);
    successResponse(res, 200, "Applications retrieved successfully", result);
  })
);

jobcontroller.post(
  "/:jobId/apply",
  authorize(Role.USER),
  uploadPdf.single("userCV"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("userCV file (PDF) is required", 422);
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const application = await JobService.applyToJob(jobId ?? "", req.user!, req.file);
    successResponse(res, 201, "Application submitted successfully", application);
  })
);

jobcontroller.patch(
  "/applications/:applicationId/status",
  validateDto(UpdateApplicationStatusDto),
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body as { status: ApplicationStatus };
    const applicationId = Array.isArray(req.params.applicationId) ? req.params.applicationId[0] : req.params.applicationId;
    const application = await JobService.updateApplicationStatus(applicationId ?? "", req.user!, status);
    successResponse(res, 200, "Application status updated successfully", application);
  })
);

export default jobcontroller;
