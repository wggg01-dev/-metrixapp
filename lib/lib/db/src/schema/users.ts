import { pgTable, text, serial, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("user_role", ["admin", "manager", "member", "viewer"]);
export const userStatusEnum = pgEnum("user_status", ["active", "invited", "suspended"]);

export const teamUsersTable = pgTable("team_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default("member"),
  status: userStatusEnum("status").notNull().default("active"),
  avatarUrl: text("avatar_url"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTeamUserSchema = createInsertSchema(teamUsersTable).omit({ id: true, updatedAt: true });
export type InsertTeamUser = z.infer<typeof insertTeamUserSchema>;
export type TeamUser = typeof teamUsersTable.$inferSelect;
