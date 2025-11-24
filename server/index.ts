import ApiRoute from '@server/routes'
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'
import { fromTypes, openapi } from '@elysiajs/openapi'
import { authMiddleware } from '@server/model/authMiddleware'
import { cors } from '@elysiajs/cors'
import { rateLimit } from 'elysia-rate-limit'
import { ip } from 'elysia-ip'
import './error-translation'
import type { SocketAddress } from 'bun'
import type { Generator } from 'elysia-rate-limit'
import { HandledError } from './handled-error'

const appUrl = new URL(Bun.env.VITE_API_URL || 'http://localhost:3000')
const origin = appUrl.origin

const ipGenerator: Generator<{ ip: SocketAddress }> = (_req, _serv, { ip }) => {
  return ip.address
}

export const app = new Elysia({
	prefix: '/api',
    aot: true,
	precompile: true
})
    .error({
        HandledError
    })
    .use(ip())
    .use(rateLimit({
        max: 30,
        scoping: 'global',
        generator: ipGenerator
    }))
	.use(authMiddleware)
    .use(cors({
        'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        'origin': origin,
    }))
    .onError(({ error, status, code }) => {
         if (code === 'VALIDATION')
            return status(400, {
                message: `ตรวจสอบช่องกรอกข้อมูลดังนี้
${error.all.map((e) => `- ${(e as any).path.slice(1)} ${e.summary}`).join('\n')}`,
            })

        if (code === 'HandledError')
            return status(400, {
                message: error.message,
            })

        if (code === 'NOT_FOUND')
            return status(404, {
                message: 'ไม่พบเส้นทางที่ร้องขอ',
            })

        if (code === 'INVALID_FILE_TYPE')
            return status(400, {
                message: 'ไฟล์ที่อัปโหลดไม่ถูกต้อง',
            })

        console.error(error)
        return status(500, {
            message: 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้งภายหลัง',
        })
	})
    .use(
        openapi({
            references: fromTypes('server/index.ts'),

        })
    )
    .use(serverTiming())
    .use(ApiRoute)

export type App = typeof app
