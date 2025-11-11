import { authMiddleware } from "@server/model/authMiddleware"
import { adminRoute } from "@server/routes/admin"
import Elysia from "elysia"

const ApiRoute = new Elysia<''>({
	prefix: ''
}).use(authMiddleware)
	.get('/', async ()=>{
		return {
			appVersion: __APP_VERSION__
		}
	})
	.use(adminRoute)

export default ApiRoute