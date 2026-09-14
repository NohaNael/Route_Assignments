export const UserRepository: any = {
  async findById(id: string): Promise<any> {
    return null;
  },
  async findByEmail(email: string): Promise<any> {
    return null;
  },
  async create(data: Record<string, unknown>): Promise<any> {
    return { ...data, _id: "stub-user-id" };
  },
  async updateById(id: string, data: Record<string, unknown>): Promise<any> {
    return { _id: id, ...data };
  },
  async softDeleteById(id: string): Promise<any> {
    return { _id: id, deletedAt: new Date() };
  },
};
