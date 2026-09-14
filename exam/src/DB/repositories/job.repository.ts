export const JobRepository: any = {
  async create(data: Record<string, unknown>): Promise<any> {
    return { ...data, _id: "stub-job-id" };
  },
  async findById(id: string): Promise<any> {
    return null;
  },
  async deleteById(id: string): Promise<any> {
    return { _id: id, deleted: true };
  },
  async find(filter: Record<string, unknown>, skip = 0, limit = 10, sort: Record<string, unknown> = {}): Promise<any> {
    return [];
  },
  async count(filter: Record<string, unknown>): Promise<any> {
    return 0;
  },
};
