import { createRouter } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
// Import the generated route tree
import { routeTree } from "./routeTree.gen"

// Create a new router instance
export const getRouter = () => {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		defaultNotFoundComponent: () => {
			return (
				<div className="h-full flex items-center justify-center flex-col my-auto">
					<div className="my-auto">
						<h1 className="text-center">
							<span className="text-6xl font-bold mr-2 block mb-1">404</span>
							ไม่พบหน้าที่คุณกำลังค้นหา
						</h1>
					</div>
				</div>
			)
		},
		defaultErrorComponent: ({ error }) => {
			return (
				<div className="h-full flex items-center justify-center flex-col my-auto">
					<div className="my-auto">
						<h1 className="text-center">
							<span className="text-6xl font-bold mr-2 block mb-1">500</span>
							เกิดข้อผิดพลาด: {error.message}
						</h1>
					</div>
				</div>
			)
		},
		defaultPendingComponent: () => (
			<div className="h-full flex items-center justify-center flex-col my-auto">
				<div className="my-auto">
					<Loader2
						className="animate-spin mx-auto size-24 mb-4"
						size={48}
					/>
					<div className="text-center text-lg">กำลังโหลด...</div>
				</div>
			</div>
		)
	})

	return router
}
