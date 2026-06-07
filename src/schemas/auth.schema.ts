import { mysqlTable } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";

export const Auth = mysqlTable("auth", {
  id:t.varchar('id',{length:6}).notNull(),
  name: t.varchar("name", { length: 30 }).notNull(),
  email: t.varchar("email", { length: 255 }).notNull().primaryKey(),
  password: t.varchar("password", { length: 255 }),
  saltString: t.varchar("salt_string", { length: 255 }),
  isBlocked: t.boolean().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})
