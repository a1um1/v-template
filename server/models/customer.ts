import { db } from "@server/db";
import { customer } from "@server/schema/customer";
import { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from 'drizzle-typebox';
import { t } from "elysia";
import { BaseModel, ModelConfig, UseAdapter } from "./base";
import { DrizzleDataAdapter } from "./drizzle-adapter";

export type Customer = InferSelectModel<typeof customer>;
export const InsertCustomerSchema = createInsertSchema(customer)
export type NewCustomer = typeof InsertCustomerSchema.static;


@UseAdapter(new DrizzleDataAdapter<typeof customer, Customer, NewCustomer>(db))
@ModelConfig<typeof customer, Customer>({
  table: customer,
  searchFields: ["fullName", "phone"],
  extendsSearch: t.Object({})
})
export class CustomerModel extends BaseModel<typeof customer, Customer, NewCustomer> {}
