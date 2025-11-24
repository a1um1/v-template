import { ButtonLinks } from "@/components/ui/buttonLink"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { KeyRoundIcon, MonitorIcon } from "lucide-react"

export const Route = createFileRoute("/dashboard/settings")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
			<div className="flex gap-4 flex-col xl:col-span-1">
				{[
					{
						"href": "/dashboard/settings",
						"label": "เปลี่ยนรหัสผ่าน",
						icon: KeyRoundIcon
					},
					{
						"href": "/dashboard/settings/sessions",
						"label": "เซสชันที่เข้าสู่ระบบ",
						icon: MonitorIcon
					}
				].map((link) => (
					<ButtonLinks
						key={link.href}
						href={link.href}
						variant="outline"
						className="w-full justify-start"
						size="lg">
						<link.icon className="size-5" />
						{link.label}
					</ButtonLinks>
				))}
			</div>
			<div className="xl:col-span-3">
				<Outlet />
			</div>
		</div>
	)
}
