import { SessionsCard } from "@daveyplate/better-auth-ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/settings/sessions")({
	component: RouteComponent
})

function RouteComponent() {
	return <SessionsCard />
}
