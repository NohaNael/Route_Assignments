import { CompanyRepository } from "../../DB/repositories/company.repository";
import { conflictException, forbiddenException, notFoundException } from "../../Utils/response/error.response";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { uploadBufferToCloudinary, destroyCloudinaryAsset } from "../../Utils/upload/upload.util";
import { CONSTANTS } from "../../config/constants";
import { Role } from "../../types/enums";
import { IUser } from "../../types/interfaces";
import { Types } from "mongoose";

function assertIsOwnerOrAdmin(company: { createdBy: { toString(): string } }, user: IUser) {
  const isOwner = company.createdBy.toString() === user._id.toString();
  const isAdmin = user.role === Role.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new forbiddenException("Only the company owner or an admin can perform this action");
  }
}

export const CompanyService = {
  async createCompany(userId: string, dto: CreateCompanyDto, legalAttachmentFile: Express.Multer.File) {
    const [nameTaken, emailTaken] = await Promise.all([
      CompanyRepository.findOne({ companyName: dto.companyName }),
      CompanyRepository.findOne({ companyEmail: dto.companyEmail }),
    ]);
    if (nameTaken) throw new conflictException("Company name already exists");
    if (emailTaken) throw new conflictException("Company email already exists");

    const legalAttachment = await uploadBufferToCloudinary(
      legalAttachmentFile.buffer,
      CONSTANTS.CLOUDINARY_FOLDERS.LEGAL_ATTACHMENTS
    );

    const company = await CompanyRepository.create({
      ...dto,
      createdBy: new Types.ObjectId(userId),
      legalAttachment,
      HRs: [],
      approvedByAdmin: false,
    });

    return company;
  },

  async updateCompany(companyId: string, user: IUser, dto: UpdateCompanyDto) {
    const company = await CompanyRepository.findById(companyId);
    if (!company || company.deletedAt) throw new notFoundException("Company not found");

    // Only the owner may update (not just any HR, and not admins per the "owner update" rule).
    if (company.createdBy.toString() !== user._id.toString()) {
      throw new forbiddenException("Only the company owner can update company data");
    }

    Object.assign(company, dto);
    await company.save();
    return company;
  },

  async softDeleteCompany(companyId: string, user: IUser) {
    const company = await CompanyRepository.findById(companyId);
    if (!company || company.deletedAt) throw new notFoundException("Company not found");

    assertIsOwnerOrAdmin(company, user);

    company.deletedAt = new Date();
    await company.save();
    return { deleted: true };
  },

  async getCompanyWithJobs(companyId: string) {
    const company = await CompanyRepository.findByIdWithJobs(companyId);
    if (!company || company.deletedAt) throw new notFoundException("Company not found");
    return company;
  },

  async searchByName(name: string) {
    return CompanyRepository.searchByName(name);
  },

  async uploadLogo(companyId: string, user: IUser, file: Express.Multer.File) {
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new notFoundException("Company not found");
    assertIsOwnerOrAdmin(company, user);

    const media = await uploadBufferToCloudinary(file.buffer, CONSTANTS.CLOUDINARY_FOLDERS.COMPANY_LOGOS);
    company.logo = media;
    await company.save();
    return media;
  },

  async uploadCoverPic(companyId: string, user: IUser, file: Express.Multer.File) {
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new notFoundException("Company not found");
    assertIsOwnerOrAdmin(company, user);

    const media = await uploadBufferToCloudinary(file.buffer, CONSTANTS.CLOUDINARY_FOLDERS.COMPANY_COVERS);
    company.coverPic = media;
    await company.save();
    return media;
  },

  async deleteLogo(companyId: string, user: IUser) {
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new notFoundException("Company not found");
    assertIsOwnerOrAdmin(company, user);

    await destroyCloudinaryAsset(company.logo?.public_id);
    company.logo = undefined;
    await company.save();
    return { deleted: true };
  },

  async deleteCoverPic(companyId: string, user: IUser) {
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new notFoundException("Company not found");
    assertIsOwnerOrAdmin(company, user);

    await destroyCloudinaryAsset(company.coverPic?.public_id);
    company.coverPic = undefined;
    await company.save();
    return { deleted: true };
  },
};
