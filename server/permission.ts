import { createAccessControl, Subset } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const baseRole = ["view", "insert", "update", "delete"] as const;

export const statement = {
	...defaultStatements,
  project: baseRole,
	adminDashboard: ['view'],
} as const

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    project: ["view", "insert"],
});

export const systemAdmin = ac.newRole({
	...statement,
	...adminAc,
} as unknown as Subset<keyof typeof statement, typeof statement>);

export const allRoles = {
	user,
	systemAdmin,
} as const

export type Role = keyof typeof allRoles;