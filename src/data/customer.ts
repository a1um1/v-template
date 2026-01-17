import { eden, useEdenQuery } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCustomers(options?: { cursor?: string; limit?: number; q?: string; direction?: 'asc' | 'desc'; sortBy?: string }) {
	return useEdenQuery(
		['customer', options?.cursor, options?.limit, options?.q, options?.direction, options?.sortBy],
		() => eden.customers.get({
			query: {
				cursor: options?.cursor,
				limit: options?.limit,
				q: options?.q,
				direction: options?.direction,
				sortBy: options?.sortBy,
			}
		})
	);
}

export function useCustomerById(id: string) {
	return useEdenQuery(['customer', id], () => eden.customers({
		id: id
	}).get())
}

export type CustomerInput = {
	fullName: string;
	email: string;
	phone?: string;
	notes?: string;
};

export function useCreateCustomer() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CustomerInput) => {
			const response = await eden.customers.post(data);
			if (response.error) throw response.error;
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customer'] });
			toast.success("Customer created successfully");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to create customer");
		},
	});
}

export function useUpdateCustomer(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<CustomerInput>) => {
			const response = await eden.customers({ id }).put(data);
			if (response.error) throw response.error;
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customer'] });
			toast.success("Customer updated successfully");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to update customer");
		},
	});
}

export function useDeleteCustomer() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await eden.customers({ id }).delete();
			if (response.error) throw response.error;
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customer'] });
			toast.success("Customer deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to delete customer");
		},
	});
}
