import { ac, systemAdmin, user } from "@server/permission"
import { useMutation, useQuery } from "@tanstack/react-query"
import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const url = new URL(import.meta.env.VITE_API_URL || "http://localhost:3000")
export const authClient = createAuthClient({
	baseURL: url.href,
	plugins: [
		adminClient({
			ac,
			roles: {
				systemAdmin,
				user
			}
		})
	]
})

export const useUser = () => {
	return useQuery({
		queryKey: [
			"session"
		],
		queryFn: async () => {
			const { data, error } = await authClient.getSession()
			if (error) throw error
			return data
		}
	})
}

export const useIsAuthenticated = () => {
	const { data: user } = useUser()
	return {
		isAuthenticated: Boolean(user)
	}
}

export const useSignIn = () => {
	return useMutation({
		mutationKey: [
			"user",
			"sign-in"
		],
		mutationFn: async (params: {
			email: string
			password: string
			rememberMe: boolean
		}) => {
			const { data, error } = await authClient.signIn.email({
				"email": params.email,
				"password": params.password,
				rememberMe: params.rememberMe
			})
			if (error) throw error
			return {
				message: "เข้าสู่ระบบสำเร็จ",
				user: data?.user
			}
		}
	})
}

export const useSignUp = () => {
	return useMutation({
		mutationKey: [
			"user",
			"sign-up"
		],
		mutationFn: async (body: {
			firstName: string
			lastName: string
			email: string
			password: string
			confirmPassword: string
		}) => {
			if (body.password !== body.confirmPassword)
				throw new Error("รหัสผ่านไม่ตรงกัน")

			const { error } = await authClient.signUp.email({
				email: body.email,
				password: body.password,
				name: `${body.firstName} ${body.lastName}`.replace(/\s+/g, " ").trim()
			})
			if (error) throw error
			return {
				message: "สมัครสมาชิกสำเร็จ"
			}
		}
	})
}

export const useSignOut = () => {
	return useMutation({
		mutationKey: [
			"user",
			"sign-out"
		],
		mutationFn: async () => {
			const { error } = await authClient.signOut()
			if (error) throw error
			return {
				success: true
			}
		}
	})
}
