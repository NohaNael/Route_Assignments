import { JobRepository } from "../../DB/repositories/job.repository";
import { CompanyRepository } from "../../DB/repositories/company.repository";
import { ApplicationRepository } from "../../DB/repositories/application.repository";
import { conflictException, forbiddenException, notFoundException } from "../../Utils/response/error.response";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobFilterDto } from "./dto/job-filter.dto";
import { buildPaginationOptions, buildPaginationMeta, IPaginationQuery } from "../../Utils/pagination/pagination.util";
import { IUser } from "../../types/interfaces";
import { ApplicationStatus, Role } from "../../types/enums";
import { uploadBufferToCloudinary } from "../../Utils/upload/upload.util";
import { CONSTANTS } from "../../config/constants";
import { sendEmail, applicationAcceptedTemplate, applicationRejectedTemplate } from "../../Utils/email/email.util";
import { getIO, SOCKET_EVENTS } from "../../Utils/socket/socket.util";
import { Types } from "mongoose";

async function assertUserIsCompanyOwnerOrHR(companyId: string, user: IUser) {
  const company = await CompanyRepository.findById(companyId);
  if (!company || company.deletedAt) throw new notFoundException("Company not found");

  const isOwner = company.createdBy.toString() === user._id.toString();
  const isHR = company.HRs.some((hrId: { toString(): string }) => hrId.toString() === user._id.toString());

  if (!isOwner && !isHR) {
    throw new forbiddenException("Only the company owner or an HR of this company can perform this action");
  }
  return company;
}

export const JobService = {
  async createJob(companyId: string, user: IUser, dto: CreateJobDto) {
    await assertUserIsCompanyOwnerOrHR(companyId, user);

    const job = await JobRepository.create({
      ...dto,
      companyId: new Types.ObjectId(companyId),
      addedBy: user._id,
      closed: false,
    });
    return job;
  },

  async updateJob(jobId: string, user: IUser) {
    const job = await JobRepository.findById(jobId);
    if (!job) throw new notFoundException("Job not found");

    const company = await CompanyRepository.findById(job.companyId.toString());
    if (!company) throw new notFoundException("Company not found");

    // "Only the owner" = the company owner (createdBy), not any arbitrary HR.
    if (company.createdBy.toString() !== user._id.toString()) {
      throw new forbiddenException("Only the company owner can update this job");
    }

    return job;
  },

  async applyUpdateJob(jobId: string, user: IUser, dto: UpdateJobDto) {
    const job = await this.updateJob(jobId, user);
    Object.assign(job, dto, { updatedBy: user._id });
    await job.save();
    return job;
  },

  async deleteJob(jobId: string, user: IUser) {
    const job = await JobRepository.findById(jobId);
    if (!job) throw new notFoundException("Job not found");

    // Only an HR related to the job's company (or the owner) can delete.
    await assertUserIsCompanyOwnerOrHR(job.companyId.toString(), user);

    await JobRepository.deleteById(jobId); // triggers cascade-delete of applications via model hook
    return { deleted: true };
  },

  async getJobsForCompany(companyId: string | undefined, companyName: string | undefined, query: IPaginationQuery) {
    const { skip, limit, page, sort } = buildPaginationOptions(query);

    const filter: Record<string, unknown> = {};
    if (companyId) {
      filter.companyId = companyId;
    } else if (companyName) {
      const companies = await CompanyRepository.searchByName(companyName);
      filter.companyId = { $in: companies.map((c: { _id: unknown }) => c._id) };
    }

    const [jobs, total] = await Promise.all([JobRepository.find(filter, skip, limit, sort), JobRepository.count(filter)]);
    return { data: jobs, ...buildPaginationMeta(total, page, limit) };
  },

  async getFilteredJobs(filters: JobFilterDto) {
    const { skip, limit, page, sort } = buildPaginationOptions(filters);

    const filter: Record<string, unknown> = {};
    if (filters.workingTime) filter.workingTime = filters.workingTime;
    if (filters.jobLocation) filter.jobLocation = filters.jobLocation;
    if (filters.seniorityLevel) filter.seniorityLevel = filters.seniorityLevel;
    if (filters.jobTitle) filter.jobTitle = { $regex: filters.jobTitle, $options: "i" };
    if (filters.technicalSkills) {
      const skills = filters.technicalSkills.split(",").map((s) => s.trim());
      filter.technicalSkills = { $in: skills };
    }

    const [jobs, total] = await Promise.all([JobRepository.find(filter, skip, limit, sort), JobRepository.count(filter)]);
    return { data: jobs, ...buildPaginationMeta(total, page, limit) };
  },

  async getApplicationsForJob(jobId: string, user: IUser, query: IPaginationQuery) {
    const job = await JobRepository.findById(jobId);
    if (!job) throw new notFoundException("Job not found");

    await assertUserIsCompanyOwnerOrHR(job.companyId.toString(), user);

    const { skip, limit, page, sort } = buildPaginationOptions(query);
    const filter = { jobId };
    const [applications, total] = await Promise.all([
      ApplicationRepository.find(filter, skip, limit, sort),
      ApplicationRepository.count(filter),
    ]);

    return { data: applications, ...buildPaginationMeta(total, page, limit) };
  },

  async applyToJob(jobId: string, user: IUser, cvFile: Express.Multer.File) {
    if (user.role !== Role.USER) {
      throw new forbiddenException("Only regular users can apply to jobs");
    }

    const job = await JobRepository.findById(jobId);
    if (!job || job.closed) throw new notFoundException("Job not found or closed");

    const alreadyApplied = await ApplicationRepository.find({ jobId, userId: user._id }, 0, 1, {});
    if (alreadyApplied.length > 0) {
      throw new conflictException("You have already applied to this job");
    }

    const userCV = await uploadBufferToCloudinary(cvFile.buffer, CONSTANTS.CLOUDINARY_FOLDERS.CVS);

    const application = await ApplicationRepository.create({
      jobId: new Types.ObjectId(jobId),
      userId: user._id,
      userCV,
      status: ApplicationStatus.PENDING,
    });

    // Notify the HR/owner in real time that a new application came in.
    getIO().to(`company:${job.companyId.toString()}`).emit(SOCKET_EVENTS.NEW_APPLICATION, {
      jobId,
      applicationId: application._id,
      applicantId: user._id,
    });

    return application;
  },

  async updateApplicationStatus(applicationId: string, user: IUser, status: ApplicationStatus) {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) throw new notFoundException("Application not found");

    const job = await JobRepository.findById(application.jobId.toString());
    if (!job) throw new notFoundException("Job not found");

    await assertUserIsCompanyOwnerOrHR(job.companyId.toString(), user);

    const updated = await ApplicationRepository.updateById(applicationId, { status });
    if (!updated) throw new notFoundException("Application not found");

    if (status === ApplicationStatus.ACCEPTED || status === ApplicationStatus.REJECTED) {
      const populated = await ApplicationRepository.findByIdWithUser(applicationId);
      const applicantEmail = ((populated?.userId as unknown) as { email?: string })?.email;
      if (applicantEmail) {
        const template =
          status === ApplicationStatus.ACCEPTED
            ? applicationAcceptedTemplate(job.jobTitle)
            : applicationRejectedTemplate(job.jobTitle);
        await sendEmail({
          to: applicantEmail,
          subject: status === ApplicationStatus.ACCEPTED ? "Application Accepted" : "Application Update",
          html: template,
        });
      }
    }

    return updated;
  },
};
