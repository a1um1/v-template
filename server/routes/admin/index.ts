import { authMiddleware } from "@server/model/authMiddleware";
import Elysia, { t } from "elysia";

const AdminRoute = new Elysia<'/admin'>({
	prefix: '/admin'
})
	.use(authMiddleware)
	.guard({
		auth: {
			'permissions': {
				'adminDashboard': ['view']
			}
		}
	})
	.get('/', () => {
		return {
			message: 'Welcome to the admin dashboard'
		}
	})
	.post('/settings', () => {
		return {
			message: 'Admin settings updated'
		}
	}, {
		body: t.Object({
			settingName: t.String(),
			settingValue: t.String()
		})
	});

export default AdminRoute;