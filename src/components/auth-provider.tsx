import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack"
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack"
import { Link, useRouter } from "@tanstack/react-router"
import { authClient } from "@/data/auth"
import betterAuthLocale from "@/data/locale/better-auth.json"
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
				Link={({ href, ...props }) => (
					<Link
						to={href}
						{...props}
					/>
				)}
				localization={betterAuthLocale}
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
				}>
				{children}
			</AuthUIProviderTanstack>
		</AuthQueryProvider>
	)
}
