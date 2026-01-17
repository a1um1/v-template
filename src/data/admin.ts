import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eden, useEdenQuery } from "./api";

export type User = NonNullable<Awaited<ReturnType<typeof eden.admin.users.get>>['data']>[number];

export function useAdminUsers() {
	return useEdenQuery(
		['admin', 'users'],
		() => eden.admin.users.get()
	);
}

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	role?: string;
};

export function useCreateAdminUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateUserInput) => {
			const response = await eden.admin.users.post(data);
			if (response.error) throw response.error;
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
			toast.success("User created successfully");
		},
		onError: () => {
			toast.error("Failed to create user");
		},
	});
}

export function useUpdateUserRole(userId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (role: string) => {
			const response = await (eden.admin.users as any)[userId].put({ role });
			if (response.error) throw response.error;
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
			toast.success("User role updated successfully");
		},
		onError: () => {
			toast.error("Failed to update user role");
		},
	});
}

export function useChangeUserPassword(userId: string) {
	return useMutation({
		mutationFn: async (password: string) => {
			const response = await (eden.admin.users as any)[userId].password.put({ password });
			if (response.error) throw response.error;
			return response.data;
		},
		onSuccess: () => {
			toast.success("Password changed successfully");
		},
		onError: () => {
			toast.error("Failed to change password");
		},
	});
}

export function useBanUser(userId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { banned: boolean; reason?: string; expiresAt?: string }) => {
			const response = await (eden.admin.users as any)[userId].ban.put(data);
			if (response.error) throw response.error;
			return response.data;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
			toast.success(
				`User ${variables.banned ? 'banned' : 'unbanned'} successfully`
			);
		},
		onError: () => {
			toast.error("Failed to update user ban status");
		},
	});
}
