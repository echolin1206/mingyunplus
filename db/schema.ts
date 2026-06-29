import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  decimal,
  index,
} from "drizzle-orm/mysql-core";

// ─── Users (auto-created by auth feature) ───
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Orders (支付订单) ───
export const orders = mysqlTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    orderNo: varchar("orderNo", { length: 64 }).notNull().unique(),
    type: mysqlEnum("type", ["single", "lifetime"]).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: mysqlEnum("status", ["pending", "paid", "failed", "cancelled"])
      .default("pending")
      .notNull(),
    payMethod: varchar("payMethod", { length: 32 }),
    paidAt: timestamp("paidAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_orders_userId").on(table.userId),
    index("idx_orders_orderNo").on(table.orderNo),
    index("idx_orders_status").on(table.status),
  ]
);

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ─── Memberships (会员状态) ───
export const memberships = mysqlTable(
  "memberships",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true })
      .notNull()
      .unique(),
    type: mysqlEnum("type", ["single", "lifetime"]).notNull(),
    status: mysqlEnum("status", ["active", "expired"])
      .default("active")
      .notNull(),
    orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
    singleUsed: bigint("singleUsed", { mode: "number", unsigned: true })
      .default(0)
      .notNull(),
    validUntil: timestamp("validUntil"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_memberships_userId").on(table.userId)]
);

export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = typeof memberships.$inferInsert;
