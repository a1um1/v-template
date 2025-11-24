import Elysia from "elysia";

export const adminRoute = new Elysia({ prefix: '/admin' })
	// .use(authMiddleware)
	.get('/', () => {
		return {
			message: 'Welcome to the admin dashboard'
		}
	})