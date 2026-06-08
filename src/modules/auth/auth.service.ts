import type { InferInsertModel } from "drizzle-orm";
import { Auth } from "../../schemas/auth.schema.ts";
import { AuthRepository } from "./auth.repository.ts";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  async getUserByEmail(email: string) {
    const user = await this.authRepository.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async createUser(
    user: InferInsertModel<typeof Auth>
  ) {
    const existingUser =
      await this.authRepository.getUserByEmail(
        user.email
      );

    if (existingUser) {
      throw new Error("User already exists");
    }

    return this.authRepository.createUser(user);
  }

  async updateUser(
    id: string,
    data: Partial<typeof Auth.$inferInsert>
  ) {
    return this.authRepository.updateUser(id, data);
  }

  async deleteUser(id: string) {
    return this.authRepository.deleteUser(id);
  }
}