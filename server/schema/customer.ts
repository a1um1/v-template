import { json, pgTable, text, index } from "drizzle-orm/pg-core";
import { timestampSchema } from "./utils";

export const customer = pgTable(
  "customer",
  {
    id: text()
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    fullName: text().notNull(),
    email: text().notNull().unique(),
    phone: text(),
    notes: text(),
    ...timestampSchema,
  },
  (table) => [
    index("customer_email_idx").on(table.email),
    index("customer_name_idx").on(table.fullName),
  ],
);
