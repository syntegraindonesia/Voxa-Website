import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Wishlist: one row per (userId, productId) pair
export const wishlists = mysqlTable('wishlists', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull(),
  productId: varchar('productId', { length: 128 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = typeof wishlists.$inferInsert;

// Cart items: one row per (userId, productId, color) combination
export const cartItems = mysqlTable('cartItems', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull(),
  productId: varchar('productId', { length: 128 }).notNull(),
  color: varchar('color', { length: 64 }).default('Default').notNull(),
  quantity: int('quantity').default(1).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// Articles: AI-generated and manually created articles for the Artikel section
export const articlesTable = mysqlTable('articles', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 64 }).notNull().default('Berita VOXA'),
  author: varchar('author', { length: 128 }).notNull().default('Tim Redaksi VOXA'),
  tags: text('tags'), // JSON array stored as string
  imageUrl: text('imageUrl'),
  readTime: int('readTime').notNull().default(5),
  featured: mysqlEnum('featured', ['yes', 'no']).notNull().default('no'),
  status: mysqlEnum('status', ['draft', 'published']).notNull().default('draft'),
  seoKeywords: text('seoKeywords'), // comma-separated keywords
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp('publishedAt'),
});
export type ArticleRow = typeof articlesTable.$inferSelect;
export type InsertArticle = typeof articlesTable.$inferInsert;

// Orders: one row per checkout attempt, linked to a Xendit invoice
export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  xenditInvoiceId: varchar('xenditInvoiceId', { length: 128 }).notNull().unique(),
  externalId: varchar('externalId', { length: 128 }).notNull().unique(),
  status: mysqlEnum('status', ['pending', 'paid', 'expired', 'failed']).notNull().default('pending'),
  totalAmount: int('totalAmount').notNull(),
  customerName: varchar('customerName', { length: 256 }).notNull(),
  customerEmail: varchar('customerEmail', { length: 320 }).notNull(),
  customerPhone: varchar('customerPhone', { length: 32 }).notNull(),
  customerAddress: text('customerAddress'),
  // JSON array of { productId, name, quantity, unitPrice }
  items: text('items').notNull(),
  invoiceUrl: text('invoiceUrl').notNull(),
  paidAt: timestamp('paidAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Archived Google Ads campaigns — admin can hide campaigns from the dashboard
// without deleting them from Google Ads. Filtered client-side against getCampaigns.
export const archivedCampaigns = mysqlTable('archivedCampaigns', {
  id: int('id').autoincrement().primaryKey(),
  campaignId: varchar('campaignId', { length: 64 }).notNull().unique(),
  archivedAt: timestamp('archivedAt').defaultNow().notNull(),
});
export type ArchivedCampaign = typeof archivedCampaigns.$inferSelect;

// SEO/GEO audits: one row per full-site scan
export const seoAudits = mysqlTable('seoAudits', {
  id: int('id').autoincrement().primaryKey(),
  seoScore: int('seoScore').notNull(),        // 0..100 overall SEO score
  geoScore: int('geoScore').notNull(),        // 0..100 overall GEO score
  // Full audit payload: per-page scores + issues + recommendations. JSON blob.
  data: text('data').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
export type SeoAudit = typeof seoAudits.$inferSelect;

// Approved SEO overrides applied to specific pages by path.
// The Express HTML middleware injects these into <head> before serving.
export const pageOverrides = mysqlTable('pageOverrides', {
  id: int('id').autoincrement().primaryKey(),
  path: varchar('path', { length: 256 }).notNull().unique(),  // e.g. "/" or "/sepeda-listrik"
  title: varchar('title', { length: 256 }),
  description: varchar('description', { length: 512 }),
  ogTitle: varchar('ogTitle', { length: 256 }),
  ogDescription: varchar('ogDescription', { length: 512 }),
  ogImage: varchar('ogImage', { length: 512 }),
  canonical: varchar('canonical', { length: 512 }),
  robots: varchar('robots', { length: 128 }),
  jsonLd: text('jsonLd'),                     // stringified JSON-LD schema block
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});
export type PageOverride = typeof pageOverrides.$inferSelect;

// Audit log of every applied fix (for revert + history)
export const seoFixHistory = mysqlTable('seoFixHistory', {
  id: int('id').autoincrement().primaryKey(),
  path: varchar('path', { length: 256 }).notNull(),
  fixType: varchar('fixType', { length: 64 }).notNull(),  // e.g. "meta_description", "og_tags", "json_ld"
  beforeValue: text('beforeValue'),
  afterValue: text('afterValue'),
  appliedAt: timestamp('appliedAt').defaultNow().notNull(),
});
export type SeoFixHistory = typeof seoFixHistory.$inferSelect;

// Content of /llms.txt (single-row table). Rebuilt on demand.
export const llmsTxt = mysqlTable('llmsTxt', {
  id: int('id').primaryKey().default(1),
  content: text('content').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});
export type LlmsTxt = typeof llmsTxt.$inferSelect;