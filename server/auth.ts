import { db } from "@server/db";
import { betterAuth } from "better-auth/minimal";
import { admin as adminPlugin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { ac, allRoles } from "@server/permission";

export const auth = betterAuth({
  experimental: { joins: true },
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
        ac: ac,
        roles: allRoles
    }),
  ],
	session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});