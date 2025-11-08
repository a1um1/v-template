import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack"
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack"
import { Link, useRouter } from "@tanstack/react-router"
import { authClient } from "@/data/auth"
export default function AuthProvider({
	children
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	return (
		<AuthQueryProvider>
			<AuthUIProviderTanstack
				authClient={authClient}
				navigate={(href) =>
					router.navigate({
						href
					})
				}
				replace={(href) =>
					router.navigate({
						href,
						replace: true
					})
				}
				Link={({ href, ...props }) => (
					<Link
						to={href}
						{...props}
					/>
				)}>
				{children}
			</AuthUIProviderTanstack>
		</AuthQueryProvider>
	)
}
