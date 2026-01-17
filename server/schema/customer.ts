import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";
import { timestampSchema } from "./utils";

export const customer = pgTable(
  "customer",
  {
    id: text()
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    fullName: text().notNull(),
    phone: text(),
    notes: text(),
    isDeleted: boolean().default(false).notNull(),
    ...timestampSchema,
  },
  (table) => [
    index("customer_name_idx").on(table.fullName),
  ],
);
