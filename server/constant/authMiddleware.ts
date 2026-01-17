import { auth } from "@server/auth";
import { Role } from "@server/constant/permission";
import Elysia from "elysia";

type functionPermitions = NonNullable<
  NonNullable<Parameters<typeof auth.api.userHasPermission>>[0]
>["body"];

export const authMiddleware = new Elysia({ name: "better-auth" }).mount(auth.handler).macro({
  auth: (config?: NonNullable<functionPermitions["permissions"]>) => ({
    async resolve({ status, request }) {
      const data = await auth.api.getSession(request);
      if (!data?.session) return status(401, {
        message: "Unauthorized",
      })
      if (config && Object.keys(config).length > 0) {
        const { success } = await auth.api.userHasPermission({
          body: {
            userId: data.user.id,
            permissions: config,
            role: data.user.role as Role,
          },
        });
        if (!success)  return status(401, {
        message: "Unauthorized",
      })
      }
      return {
        session: data.session,
        user: data.user,
      };
    },
  }),
});
