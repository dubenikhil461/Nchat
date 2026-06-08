import { db } from "../../config/db.js";
import { Auth } from "../../schemas/auth.schema.ts";
import { eq, type InferInsertModel } from "drizzle-orm";

export class AuthRepository {
  async getUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(Auth)
      .where(eq(Auth.email, email));

    return user ?? null;
  }

  async createUser(user: InferInsertModel<typeof Auth>) {
    return db.insert(Auth).values(user);
  }

  async updateUser(
    id: string,
    data: Partial<typeof Auth.$inferInsert>
  ) {
    return db
      .update(Auth)
      .set(data)
      .where(eq(Auth.id, id));
  }

  async deleteUser(id: string) {
    return db.delete(Auth).where(eq(Auth.id, id));
  }
}