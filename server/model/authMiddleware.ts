import { auth } from "@server/auth";
import { Role } from "@server/permission";
import { Session, User } from "better-auth";
import Elysia from "elysia";

type functionPermitions = NonNullable<
  NonNullable<Parameters<typeof auth.api.userHasPermission>>[0]
>["body"];

export const authMiddleware = new Elysia({ name: "better-auth" }).mount(auth.handler).macro({
  auth: (config?: NonNullable<functionPermitions["permissions"]>) => ({
    async resolve({ status, request }): Promise<{
      session: Session;
      user: User;
    }> {
      const data = await auth.api.getSession(request);
      if (!data?.session) throw new Error("Unauthorized");
      if (config && Object.keys(config).length > 0) {
        const { success } = await auth.api.userHasPermission({
          body: {
            userId: data.user.id,
            permissions: config,
            role: data.user.role as Role,
          },
        });
        if (!success) throw new Error("Unauthorized");
      }
      return {
        session: data.session,
        user: data.user,
      };
    },
  }),
});
