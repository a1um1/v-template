import ApiRoute from '@server/routes'
import { Context, Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'
import { fromTypes, openapi } from '@elysiajs/openapi'
import { auth } from '@server/auth'

const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request);
    } else {
        context.status(405)
        return "Method Not Allowed"
    }
}

export const app = new Elysia({
	prefix: '/api'
})
	.all("/auth/*", betterAuthView, {
        detail: {
            hide: true
        }
    })
    .onError(({ error, status }) => {
        status(500)
        return {
            message: 'Something went wrong!',
            error
        }
	})
    .use(openapi({
            references: fromTypes('server/index.ts')
        }))
    .use(serverTiming())
    .use(ApiRoute)

export type App = typeof app
