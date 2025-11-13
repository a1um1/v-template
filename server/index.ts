import ApiRoute from '@server/routes'
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'
import { fromTypes, openapi } from '@elysiajs/openapi'
import { authMiddleware } from '@server/model/authMiddleware'
import './error-translation'

export const app = new Elysia({
	prefix: '/api'
})
	.use(authMiddleware)
    .onError(({ error, status, code }) => {
         if (code === 'VALIDATION') {
            return status(400, {
                message: `ตรวจสอบช่องกรอกข้อมูลดังนี้
${error.all.map((e) => `- ${(e as any).path.slice(1)} ${e.summary}`).join('\n')}`,
            })
        }
        return status(500, {
            message: 'Something went wrong!',
        })
	})
    .use(openapi({
            references: fromTypes('server/index.ts')
        }))
    .use(serverTiming())
    .use(ApiRoute)

export type App = typeof app
