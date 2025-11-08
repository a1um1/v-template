import {
	SignedIn,
	UserButton,
	useAuthenticate
} from "@daveyplate/better-auth-ui"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { AppSidebar } from "@/components/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from "@/components/ui/sidebar"

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent
})

function RouteComponent() {
	useAuthenticate()
	return (
		<SignedIn>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex py-1 shrink-0 items-center gap-2 border-b">
						<div className="flex items-center gap-2 px-3 flex-1">
							<SidebarTrigger />
							<div className="w-0.5 bg-border mr-auto self-stretch" />
							<UserButton
								disableDefaultLinks
								size="sm"
								variant="ghost"
								className="[&_span]:size-8"
								classNames={{
									"trigger": {
										"user": {
											"content": "inline"
										},
										"base": "[&_svg]:hidden"
									}
								}}
							/>
						</div>
					</header>
					<div className="relative flex-1">
						<div className="flex flex-col gap-4 p-4">
							<Outlet />
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</SignedIn>
	)
}
