import { auth } from "@server/auth";
import { Session, User } from "better-auth";
import Elysia from "elysia";

export const authMiddleware = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
		auth: (config?: {
      enabled?: boolean,
      permissions?:Parameters<typeof auth.api.userHasPermission>[0]['body']['permissions']
    }) => config?.enabled || config?.permissions ? ({
      async resolve({ status, request }): Promise<{
        session: Session
        user: User
      } | {}> {
       const data = await auth.api.getSession(request)
       if (!data?.session) return status(401);
       if (config?.permissions) {
        const {success} = await auth.api.userHasPermission({
          body: {
            'userId': data.user.id,
            'permissions': config.permissions,
            'role': data.user.role as 'user' | 'systemAdmin' | undefined
          }
        })
        if (!success) return status(403)
       }
        return {
          session: data.session,
          user: data.user
        }
		}}) : {
    }
	})