import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/** Notes left by travellers — either about one destination or the island as a whole. */
export const notes = pgTable("traveller_notes", {
  id: serial("id").primaryKey(),
  destination: varchar("destination", { length: 64 }).notNull().default("sri-lanka"),
  name: varchar("name", { length: 80 }).notNull(),
  country: varchar("country", { length: 80 }).notNull().default(""),
  rating: integer("rating").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** General questions from visitors about the island. */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Note = typeof notes.$inferSelect;
