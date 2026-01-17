import { AnyPgTable } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";

export interface DataAdapter<TTable extends AnyPgTable, TSelect, TInsert> {
  list(
    table: TTable,
    options?: {
      limit?: number;
      cursor?: string;
      orderBy?: keyof TTable;
      direction?: "asc" | "desc";
      filter?: SQL<unknown>;
    },
  ): Promise<{ data: TSelect[]; nextCursor?: string }>;
  findById(table: TTable, id: string): Promise<TSelect | null>;
  search(
    table: TTable,
    query: string,
    fields: (keyof TSelect & string)[],
    options?: {
      limit?: number;
      cursor?: string;
      orderBy?: keyof TTable;
      direction?: "asc" | "desc";
    },
  ): Promise<{ data: TSelect[]; nextCursor?: string }>;
  create(table: TTable, payload: TInsert): Promise<TSelect>;
  update(table: TTable, id: string, payload: Partial<TInsert>): Promise<TSelect>;
  delete(table: TTable, id: string): Promise<void>;
}
