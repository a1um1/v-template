import { authMiddleware } from "@server/constant/authMiddleware";
import { HandledError } from "@server/constant/handled-error";
import { pagesOptions } from "@server/models/base";
import { CustomerModel, InsertCustomerSchema } from "@server/models/customer";
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
        orderBy: (query.sortBy ?? "createdAt") as any,
        direction: query.direction ?? "desc",
      });
    },
    {
      query: pagesOptions,
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
      body: InsertCustomerSchema,
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
      body: InsertCustomerSchema,
      auth: {
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
