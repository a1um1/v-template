import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from "@/components/ui/sidebar"
import { useUser } from "@/data/auth"

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent
})

function RouteComponent() {
	const { data: user, isLoading } = useUser()
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex py-2 shrink-0 items-center gap-2  border-b">
					<div className="flex items-center gap-2 px-3">
						<SidebarTrigger />
					</div>
				</header>
				<div className="relative flex-1">
					<div className="flex flex-col gap-4 p-4">
						<Outlet />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
