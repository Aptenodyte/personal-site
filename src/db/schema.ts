import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

/**
 * Messages submitted through the contact form. Blog posts live as MDX
 * files in /content/blog, so no posts table is needed.
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 220 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Comments left on blog posts. Each comment is tied to a post by its slug.
 * `parentId` enables one level of threading — a reply points to its parent
 * comment; top-level comments have a null parent.
 */
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull(),
  name: varchar("name", { length: 80 }).notNull(),
  body: text("body").notNull(),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
