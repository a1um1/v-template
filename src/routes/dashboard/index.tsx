import { createFileRoute } from "@tanstack/react-router"
import { useAppVersion } from "@/data/appVersion"

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent
})

function RouteComponent() {
	const { data, isLoading } = useAppVersion()
	return (
		<div>
			<p>Hi : App version {isLoading ? "Loading..." : data?.appVersion}</p>
		</div>
	)
}
