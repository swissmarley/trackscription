import { pgTable, text, serial, decimal, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serviceType: text("service_type").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  isFree: boolean("is_free").notNull().default(false),
  cycleType: text("cycle_type").notNull(), // "monthly" | "annually"
  startDate: date("start_date").notNull(),
  renewalDate: date("renewal_date").notNull(),
  serviceUrl: text("service_url"),
  email: text("email"),
  notes: text("notes"),
  files: text("files").array(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  subscriptionId: serial("subscription_id").references(() => subscriptions.id),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const selectSubscriptionSchema = createSelectSchema(subscriptions);

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
