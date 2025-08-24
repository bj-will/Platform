import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Audit fields reusable ---
const created = timestamp("_created").defaultNow().notNull();
const updated = timestamp("_updated").defaultNow().$onUpdate(() => new Date());
const deleted = timestamp("_deleted");

// --- Users ---
export const users = pgTable("users", {
  ...{ created, updated, deleted },

  id: serial("id").primaryKey(),
  wallet: text("wallet").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin"),

  // connections like { discord: { user_id: "123", is_notifications: true }, telegram: {...} }
  connections: jsonb("connections").$type<Record<string, any>>().default({}),

  // notifications like { categories: ["nft","meme"] }
  notificationSettings: jsonb("notification_settings")
    .$type<{ categories: string[] }>()
    .default({ categories: [] }),
});

// --- Projects ---
export const projects = pgTable("projects", {
  ...{ created, updated, deleted },

  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  twitter: text("twitter"),
  discord: text("discord"),
  site: text("site"),
  isPrimary: boolean("is_primary").default(false), // "top project"
  added: boolean("added").default(false),     // "in projects list"
});

// --- Events ---
export const events = pgTable("events", {
  ...{ created, updated, deleted },

  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  relatedProjectId: integer("related_project_id").references(() => projects.id),

  title: text("title").notNull(),
  status: text("status").default("upcoming"),
  bannerPic: text("banner_pic"),
  categories: text("categories").array().default([]).notNull(),
  types: text("types").array().default([]).notNull(),
  newsLink: text("news_link"),
  rating: integer("rating"),
  date: timestamp("date").notNull(),
  description: text("description"),
});

// --- Projects Admins (normalized relation) ---
export const projectsAdmins = pgTable("projects_admins", {
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
});

// --- Relations ---
export const usersRelations = relations(users, ({ many }) => ({
  projectsAdmins: many(projectsAdmins),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  events: many(events),
  projectsAdmins: many(projectsAdmins),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  project: one(projects, {
    fields: [events.projectId],
    references: [projects.id],
  }),
  relatedProject: one(projects, {
    fields: [events.relatedProjectId],
    references: [projects.id],
  }),
}));

export const projectsAdminsRelations = relations(projectsAdmins, ({ one }) => ({
  user: one(users, {
    fields: [projectsAdmins.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [projectsAdmins.projectId],
    references: [projects.id],
  }),
}));
