import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useEden } from "@/data/api"

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent
})

function RouteComponent() {
	const eden = useEden()
	const { data, isLoading } = useQuery({
		queryKey: [
			"version"
		],
		queryFn: async () => {
			const { data, error } = await eden.get()
			if (error) throw error
			return data
		}
	})
	return (
		<div>
			<h1>Hi</h1>
			<p>{isLoading ? "Loading..." : data?.appVersion}</p>
		</div>
	)
}
