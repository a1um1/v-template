import { authMiddleware } from "@server/constant/authMiddleware";
import { HandledError } from "@server/constant/handled-error";
import { CustomerModel } from "@server/models/customer";
import Elysia, { t } from "elysia";

const customerModel = new CustomerModel();

const CustomerRoute = new Elysia<"/customers">({
  prefix: "/customers",
})
  .use(authMiddleware)
  .guard({
    auth: {
      customer: ["view"],
    },
  })
	.get(
    "/",
    ({ query }) => {
      const term = query.q ?? "";
      return customerModel.search(term, {
        cursor: query.cursor,
        limit: query.limit ?? 20,
        orderBy: (query.sortBy ?? "createdAt") as keyof any,
        direction: query.direction ?? "desc",
      });
    },
    {
      query: t.Object({
        q: t.Optional(t.String()),
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Integer({ minimum: 1, maximum: 100 })),
        direction: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
        sortBy: t.Optional(t.String())
      }),
    },
  )
  .get("/:id", async ({ params }) => {
    const record = await customerModel.findById(params.id);
    if (!record) throw new HandledError("Customer not found");
    return record;
  })
  .post(
    "/",
    async ({ body }) => {
      return customerModel.create(body);
    },
    {
      body: t.Object({
        fullName: t.String(),
        email: t.String({ format: "email" }),
        phone: t.Optional(t.String()),
        notes: t.Optional(t.String()),
      }),
			auth: {
      customer: ["insert"],
    },
    },
  )
  .put(
    "/:id",
    async ({ body, params }) => {
      const updated = await customerModel.update(params.id, body);
      if (!updated) throw new HandledError("Customer not found");
      return updated;
    },
    {
      body: t.Object({
        fullName: t.Optional(t.String()),
        email: t.Optional(t.String({ format: "email" })),
        phone: t.Optional(t.String()),
        notes: t.Optional(t.String()),
      }),auth: {
      customer: ["update"],
    },
    },
  )
  .delete("/:id", async ({ params }) => {
    await customerModel.delete(params.id);
    return { success: true };
  },{
    auth: {
      customer: ["delete"],
    },
  });

export default CustomerRoute;
