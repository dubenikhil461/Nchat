import { mysqlTable } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";

export const Auth = mysqlTable("auth", {
  id: t.varchar("id", { length: 6 }).notNull().primaryKey(),
  name: t.varchar("name", { length: 30 }).notNull(),
  email: t.varchar("email", { length: 255 }).notNull().unique(),
  password: t.varchar("password", { length: 255 }),
  saltString: t.varchar("salt_string", { length: 255 }),
  profilePhoto: t.varchar("profile_photo", { length: 512 }),
  imagekitFileId: t.varchar("imagekit_file_id", { length: 255 }),
  isBlocked: t.boolean().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
