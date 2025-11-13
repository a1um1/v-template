import { TanStackDevtools } from "@tanstack/react-devtools"
import {
	MutationCache,
	QueryClient,
	QueryClientProvider
} from "@tanstack/react-query"
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { useEffect } from "react"
import { Toaster, toast } from "sonner"
import AuthProvider from "@/components/auth-provider"
import appCss from "../styles.css?url"

const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onError(error, _variables, _onMutateResult, mutation, _context) {
			toast.error(
				(error as any)?.value?.message || error?.message || "An error occurred",
				{
					id: mutation.mutationId
				}
			)
		},
		onSuccess(data: any, _variables, _onMutateResult, mutation, _context) {
			toast.success(data?.message || "ดำเนินการสำเร็จ", {
				id: mutation.mutationId
			})
		},
		onMutate(_variables, mutation, _context) {
			toast.loading("กำลังดำเนินการ...", {
				id: mutation.mutationId
			})
		},
		onSettled(_data, _error, _variables, _onMutateResult, _mutation, context) {
			queryClient.invalidateQueries({
				queryKey: context.mutationKey?.[0]
					? [
							context.mutationKey[0]
						]
					: [],
				exact: false
			})
		}
	})
})

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "TanStack Start Starter"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss
			}
		]
	}),

	shellComponent: RootDocument
})
declare global {
	interface Window {
		__TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient
	}
}
function RootDocument({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		if (import.meta.env.PROD) return
		window.__TANSTACK_QUERY_CLIENT__ = queryClient
	}, [])
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>{children}</AuthProvider>
				</QueryClientProvider>
				{!import.meta.env.PROD && (
					<TanStackDevtools
						config={{
							position: "bottom-right"
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />
							}
						]}
					/>
				)}
				<Scripts />
				<Toaster richColors />
			</body>
		</html>
	)
}
