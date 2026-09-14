export const CompanyRepository: any = {
  async findOne(filter: Record<string, unknown>): Promise<any> {
    return null;
  },
  async findById(id: string): Promise<any> {
    return null;
  },
  async findByIdWithJobs(id: string): Promise<any> {
    return null;
  },
  async searchByName(name: string): Promise<any> {
    return [];
  },
  async create(data: Record<string, unknown>): Promise<any> {
    return { ...data, _id: "stub-company-id" };
  },
};
