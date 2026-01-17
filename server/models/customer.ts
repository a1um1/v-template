import { db } from "@server/db";
import { customer } from "@server/schema/customer";
import {  InferSelectModel } from "drizzle-orm";
import { BaseModel, ModelConfig, UseAdapter } from "./base";
import { DrizzleDataAdapter } from "./drizzle-adapter";
import { createInsertSchema } from 'drizzle-typebox'

export type Customer = InferSelectModel<typeof customer>;
export const InsertCustomerSchema = createInsertSchema(customer)
export type NewCustomer = typeof InsertCustomerSchema.static;

const adapter = new DrizzleDataAdapter<typeof customer, Customer, NewCustomer>(db);

@UseAdapter(adapter)
@ModelConfig<typeof customer, Customer>({
  table: customer,
  searchFields: ["fullName", "email", "phone"],
})
export class CustomerModel extends BaseModel<typeof customer, Customer, NewCustomer> {}
