import { db } from "@server/db";
import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { ac, systemAdmin } from "@server/permission";
import { user } from "@server/permission";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
        ac: ac,
        roles: {
            systemAdmin,
            user,
        }
    }),
  ],
	session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});