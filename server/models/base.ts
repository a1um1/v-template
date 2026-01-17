import type { SQL } from "drizzle-orm";
import { ilike, or } from "drizzle-orm";
import { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";
import type { DataAdapter } from "./types";

type PageOptions<TTable> = {
  cursor?: string;
  limit?: number;
  orderBy?: keyof TTable;
  direction?: "asc" | "desc";
};

const DEFAULT_LIMIT = 20;

export type ModelConfigOptions<TTable extends AnyPgTable, TSelect> = {
  table: TTable;
  searchFields?: (keyof TSelect & string)[];
};

export type ModelStatics<TTable extends AnyPgTable, TSelect, TInsert> = {
  table: TTable;
  searchFields: (keyof TSelect & string)[];
  adapter?: DataAdapter<TTable, TSelect, TInsert>;
};

export type ModelConstructor<TTable extends AnyPgTable, TSelect, TInsert> = new (
  adapter?: DataAdapter<TTable, TSelect, TInsert>,
) => BaseModel<TTable, TSelect, TInsert>;

export function ModelConfig<TTable extends AnyPgTable, TSelect>(
  config: ModelConfigOptions<TTable, TSelect>,
) {
  return <T extends ModelConstructor<TTable, TSelect, any>>(constructor: T) => {
    const target = constructor as unknown as ModelStatics<TTable, TSelect, any>;
    target.table = config.table;
    target.searchFields = config.searchFields ?? [];
  };
}

export function UseAdapter<TTable extends AnyPgTable, TSelect, TInsert>(
  adapter: DataAdapter<TTable, TSelect, TInsert>,
) {
  return <T extends ModelConstructor<TTable, TSelect, TInsert>>(constructor: T) => {
    const target = constructor as unknown as ModelStatics<TTable, TSelect, TInsert>;
    target.adapter = adapter;
  };
}

export abstract class BaseModel<TTable extends AnyPgTable, TSelect, TInsert> {
  protected adapter: DataAdapter<TTable, TSelect, TInsert>;
  protected table: TTable;
  protected searchFields: (keyof TSelect & string)[];

  constructor(adapter?: DataAdapter<TTable, TSelect, TInsert>) {
    const ctor = this.constructor as unknown as ModelStatics<TTable, TSelect, TInsert>;

    if (!ctor.table) {
      throw new Error("Model missing table configuration");
    }

    const resolvedAdapter = adapter ?? ctor.adapter;
    if (!resolvedAdapter) {
      throw new Error("Model missing data adapter");
    }

    this.table = ctor.table;
    this.searchFields = ctor.searchFields ?? [];
    this.adapter = resolvedAdapter;
  }

  list(options?: PageOptions<TTable>) {
    return this.adapter.list(this.table, {
      limit: options?.limit ?? DEFAULT_LIMIT,
      cursor: options?.cursor,
      orderBy: options?.orderBy,
      direction: options?.direction,
    });
  }

  findById(id: string) {
    return this.adapter.findById(this.table, id);
  }

  search(query: string, options?: PageOptions<TTable>) {
    if (!query.trim()) return this.list(options);
    const filter = this.buildSearchFilter(query);
    return this.adapter.list(this.table, {
      limit: options?.limit ?? DEFAULT_LIMIT,
      cursor: options?.cursor,
      orderBy: options?.orderBy,
      direction: options?.direction,
      filter,
    });
  }

  protected buildSearchFilter(query: string): SQL<unknown> | undefined {
    if (!this.searchFields.length) return undefined;
    const conditions = this.searchFields
      .map((field) => this.table[field as keyof typeof this.table] as unknown as AnyPgColumn)
      .map((column) => ilike(column, `%${query}%`));
    if (!conditions.length) return undefined;
    return conditions.slice(1).reduce((acc, condition) => or(acc, condition)!, conditions[0]!);
  }

  create(payload: TInsert) {
    return this.adapter.create(this.table, payload);
  }

  update(id: string, payload: Partial<TInsert>) {
    return this.adapter.update(this.table, id, payload);
  }

  delete(id: string) {
    return this.adapter.delete(this.table, id);
  }
}
