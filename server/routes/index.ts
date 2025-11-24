import { authMiddleware } from "@server/model/authMiddleware"
import AdminRoute from "@server/routes/admin"
import Elysia from "elysia"

const ApiRoute = new Elysia<''>({
	prefix: ''
})
.use(authMiddleware)
	.get('/', async ()=>{
		return {
			appVersion: __APP_VERSION__ || 'Development',
		}
	})
	.use(AdminRoute)

export default ApiRoute