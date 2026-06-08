import { db } from "../../config/db.js";
import { Auth } from "../../schemas/auth.schema.ts";
import { eq, like, or } from "drizzle-orm";

export class UserRepository {
  async getUserById(id: string) {
    const [user] = await db
      .select()
      .from(Auth)
      .where(eq(Auth.id, id));

    return user ?? null;
  }

  async searchUsers(query: string, limit = 20) {
    const pattern = `%${query}%`;

    return db
      .select()
      .from(Auth)
      .where(or(like(Auth.name, pattern), like(Auth.email, pattern)))
      .limit(limit);
  }

  async updateUser(
    id: string,
    data: Partial<typeof Auth.$inferInsert>,
  ) {
    await db.update(Auth).set(data).where(eq(Auth.id, id));
    return this.getUserById(id);
  }
}
