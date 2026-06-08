import { mysqlTable } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";
import { Auth } from "../schemas/auth.schema.ts";
import { sql } from "drizzle-orm";
    
export const message = mysqlTable(
  "message",
  {
    id: t.varchar("id", { length: 36 }).primaryKey().generatedAlwaysAs(sql`UUID()`),
    senderId: t.varchar("sender_id", { length: 6 }).notNull().references(() => Auth.id),
    receiverId: t.varchar("receiver_id", { length: 6 }).notNull().references(() => Auth.id),
    text: t.text("text").notNull(),
    deliveredAt: t.timestamp("delivered_at"),
    readAt: t.timestamp("read_at"),
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  }
);
