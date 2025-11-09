import { authMiddleware } from "@server/model/authMiddleware";
import Elysia from "elysia";

export const adminRoute = new Elysia({ prefix: '/admin' })
	.use(authMiddleware)
	.get('/', () => 'Hello from Admin Route', {
		auth: {
			permissions: {
				'adminDashboard': ['view']
			}
		}
	})