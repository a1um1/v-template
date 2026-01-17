import { and, desc, eq, gt, ilike, lt, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import type { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";
import { db } from "@server/db";
import type { DataAdapter } from "./types";

type IdColumnTable = AnyPgTable & { id: AnyPgColumn };

type DrizzleClient = typeof db;

export class DrizzleDataAdapter<TTable extends IdColumnTable, TSelect, TInsert>
  implements DataAdapter<TTable, TSelect, TInsert>
{
  constructor(private readonly client: DrizzleClient) {}

  async list(
    table: TTable,
    { limit = 20, cursor, orderBy, direction = "desc", filter }: {
      limit?: number;
      cursor?: string;
      orderBy?: keyof TTable;
      direction?: "asc" | "desc";
      filter?: SQL<unknown>;
    } = {},
  ) {
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const orderColumn = (orderBy ? table[orderBy] : (table as any).createdAt ?? table.id) as AnyPgColumn;
    const idColumn = table.id;

    let cursorFilter;
    if (cursor) {
      const [rawOrderValue, rawId] = cursor.split("::");
      const parsedOrderValue = isNaN(Date.parse(rawOrderValue)) ? rawOrderValue : new Date(rawOrderValue);

      if (direction === "desc") {
        cursorFilter = or(
          lt(orderColumn, parsedOrderValue as any),
          and(eq(orderColumn, parsedOrderValue as any), lt(idColumn, rawId as any)),
        );
      } else {
        cursorFilter = or(
          gt(orderColumn, parsedOrderValue as any),
          and(eq(orderColumn, parsedOrderValue as any), gt(idColumn, rawId as any)),
        );
      }
    }

    const ordering = direction === "asc" ? orderColumn : desc(orderColumn);

    const whereClause = (() => {
      if (filter && cursorFilter) return and(filter, cursorFilter);
      if (filter) return filter;
      if (cursorFilter) return cursorFilter;
      return sql`true`;
    })();

    const data = (await this.client
      .select()
      .from(table as AnyPgTable)
      .where(whereClause)
      .orderBy(ordering)
      .limit(safeLimit)) as TSelect[];

    if (data.length === 0) return { data, nextCursor: undefined };

    // Only generate nextCursor if we got a full page of results (meaning there's likely more data)
    if (data.length < safeLimit) return { data, nextCursor: undefined };

    const last = data[data.length - 1] as Record<string, any>;
    const orderValue = (last as any)[(orderBy as string) || "createdAt"] ?? (last as any).createdAt ?? last.id;
    const idValue = (last as any).id;
    const nextCursor = `${orderValue instanceof Date ? orderValue.toISOString() : orderValue}::${idValue}`;

    return { data, nextCursor };
  }

  async findById(table: TTable, id: string) {
    const rows = await this.client.select().from(table as AnyPgTable).where(eq(table.id, id)).limit(1) as TSelect[];
    return rows[0] ?? null;
  }

  async search(
    table: TTable,
    query: string,
    fields: (keyof TSelect & string)[],
    options?: { limit?: number; cursor?: string; orderBy?: keyof TTable; direction?: "asc" | "desc" },
  ) {
    if (fields.length === 0) return this.list(table, options);

    const conditions = fields
      .map((field) => table[field as keyof TTable] as unknown as AnyPgColumn)
      .map((column) => ilike(column, `%${query}%`));

    const filter = conditions.slice(1).reduce((acc, condition) => or(acc, condition)!, conditions[0]!);
    return this.list(table, { ...options, filter });
  }

  async create(table: TTable, payload: TInsert) {
    const rows = await this.client.insert(table).values(payload as any).returning();
    return rows[0] as TSelect;
  }

  async update(table: TTable, id: string, payload: Partial<TInsert>) {
    const rows = (await this.client
      .update(table)
      .set(payload as any)
      .where(eq(table.id, id))
      .returning()) as TSelect[];
    return rows[0]!;
  }

  async delete(table: TTable, id: string) {
    await this.client.delete(table).where(eq(table.id, id));
  }
}
