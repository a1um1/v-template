import { auth } from "@server/auth";
import { authMiddleware } from "@server/constant/authMiddleware";
import { Role } from "@server/constant/permission";
import { db } from "@server/db";
import { user } from "@server/schema/auth";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";

const AdminRoute = new Elysia<"/admin">({
  prefix: "/admin",
})
  .use(authMiddleware)
  .guard({
    auth: {
      adminDashboard: ["view"],
    },
  })
  .get("/", () => {
    return {
      message: "Welcome to the admin dashboard",
    };
  })
  .post(
    "/settings",
    ({ body }) => {
      return {
        message: "Admin settings updated",
      };
    },
    {
      body: t.Object({
        settingName: t.String(),
        settingValue: t.String(),
      }),
    },
  )
  .get("/users", async () => {
    const users = await db.select().from(user);
    return users;
  })
  .post(
    "/users",
    async ({ body }) => {
      const data = await auth.api.createUser({
        'body': {
          'email': body.email,
          'password': body.password,
          'name': body.name,
          'role': (body.role || 'user') as Role,
        }
      })
      return data.user;
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 8 }),
        role: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/users/:id",
    async ({ params, body }) => {
      const updated = await db
        .update(user)
        .set({
          role: body.role,
          updatedAt: new Date(),
        })
        .where(eq(user.id, params.id))
        .returning();
      return updated[0];
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        role: t.String(),
      }),
    },
  )
  .put(
    "/users/:id/password",
    async ({ params, body }) => {
      const updated = await auth.api.setPassword({
        'params': {
          'id': params.id,
        },
        'body': {
          'newPassword': body.password,
        }
      });
      return updated;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        password: t.String({ minLength: 8 }),
      }),
    },
  )
  .put(
    "/users/:id/ban",
    async ({ params, body }) => {
      const updated = await db
        .update(user)
        .set({
          banned: body.banned,
          banReason: body.banned ? body.reason : null,
          banExpires: body.banned && body.expiresAt ? new Date(body.expiresAt) : null,
          updatedAt: new Date(),
        })
        .where(eq(user.id, params.id))
        .returning();
      return updated[0];
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        banned: t.Boolean(),
        reason: t.Optional(t.String()),
        expiresAt: t.Optional(t.String()),
      }),
    },
  );

export default AdminRoute;
