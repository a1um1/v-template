import ApiRoute from '@server/routes'
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'
import { fromTypes, openapi } from '@elysiajs/openapi'
import { authMiddleware } from '@server/model/authMiddleware'

export const app = new Elysia({
	prefix: '/api'
})
	.use(authMiddleware)
    .onError(({ error, status, code }) => {
        status(400)
        if (code === 'VALIDATION') {
            return {
                message: 'Validation Error',
            }
        }
        status(500)
        return {
            message: 'Something went wrong!',
        }
	})
    .use(openapi({
            references: fromTypes('server/index.ts')
        }))
    .use(serverTiming())
    .use(ApiRoute)

export type App = typeof app
