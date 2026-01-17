import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCustomerById, useCreateCustomer, useUpdateCustomer } from "@/data/customer";
import { useEffect } from "react";
import { useAppForm } from "@/components/form";



export const Route = createFileRoute("/dashboard/customer/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const isNew = id === "new";

	const { data: customer, isLoading } = useCustomerById(id === "new" ? "" : id);
	const createMutation = useCreateCustomer();
	const updateMutation = useUpdateCustomer(id);

	const form = useAppForm({
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			notes: "",
		},
		onSubmit: async ({ value }) => {
			console.log(value)
			if (isNew) {
				await createMutation.mutateAsync(value);
			} else {
				await updateMutation.mutateAsync(value);
			}
			navigate({
				to: "/dashboard/customer",
			});
		}
	});

	useEffect(() => {
		if (customer && !isNew) {
			form.reset({
				fullName: customer.fullName,
				email: customer.email,
				phone: customer.phone || "",
				notes: customer.notes || "",
			});
		}
	}, [customer, isNew, form]);

	if (isLoading && !isNew) {
		return (
			<div className="container mx-auto py-10">
				<div className="flex items-center justify-center h-64">
					<div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
				</div>
			</div>
		);
	}

	return (
		<>
			<h1>{isNew ? "Create Customer" : "Edit Customer"}</h1>
			<form.AppForm>
				<form onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}>
					<form.AppField
						name="fullName"
						children={(field) => <field.TextField label="First Name" />}
					/>

					<form.AppField
						name="email"
						children={(field) => <field.TextField label="Email" />}
					/>

					<form.AppField
						name="phone"
						children={(field) => <field.TextField label="Phone" />}
					/>

					<form.AppField
						name="notes"
						children={(field) => <field.TextField label="Notes" />}
					/>

					<div className="flex gap-3 pt-4">
						<form.BackButton />
						<form.SubmitButton />
					</div>
				</form>
			</form.AppForm>

		</>
	);
}
