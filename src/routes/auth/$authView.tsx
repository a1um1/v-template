import { AuthView } from "@daveyplate/better-auth-ui"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { useUser } from "@/data/auth"

export const Route = createFileRoute("/auth/$authView")({
	component: RouteComponent
})

function RouteComponent() {
	const { authView } = Route.useParams()
	const { data: user, isLoading } = useUser()
	const navigate = Route.useNavigate()
	useEffect(() => {
		if (authView === "sign-out") return // skip redirect on sign-out page
		if (!isLoading && user) {
			navigate({
				to: "/"
			})
		}
	}, [
		user,
		isLoading,
		authView
	])
	return (
		<main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6 min-h-dvh">
			<AuthView pathname={authView} />
			<p>Copyright &copy; {new Date().getFullYear()} V-template</p>
		</main>
	)
}
