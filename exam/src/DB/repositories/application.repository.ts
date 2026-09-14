export const ApplicationRepository: any = {
  async create(data: Record<string, unknown>): Promise<any> {
    return { ...data, _id: "stub-application-id" };
  },
  async findById(id: string): Promise<any> {
    return null;
  },
  async updateById(id: string, data: Record<string, unknown>): Promise<any> {
    return { _id: id, ...data };
  },
  async find(filter: Record<string, unknown>, skip = 0, limit = 10, sort: Record<string, unknown> = {}): Promise<any> {
    return [];
  },
  async count(filter: Record<string, unknown>): Promise<any> {
    return 0;
  },
  async findByIdWithUser(id: string): Promise<any> {
    return null;
  },
};
