import { timestamp } from "drizzle-orm/pg-core";

export const timestampSchema = {
	createdAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull(),
} as const;