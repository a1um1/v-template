import { treaty } from "@elysiajs/eden"
import { type App, app } from "@server/index"
import { createIsomorphicFn } from "@tanstack/react-start"

export const useEden = createIsomorphicFn()
	.server(() => treaty(app).api)
	.client(() => {
		const url = new URL(
			import.meta.env.VITE_API_URL || "http://localhost:3000/"
		)
		return treaty<App>(url.host).api
	})
