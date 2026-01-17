import { useAppForm } from "@/components/form";
import { useCreateCustomer, useCustomerById, useUpdateCustomer } from "@/data/customer";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";



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
			phone: "",
			notes: "",
		},
		onSubmit: async ({ value }) => {
			if (isNew) {
				await createMutation.mutateAsync(value);
			} else {
				await updateMutation.mutateAsync(value);
			}
			navigate({
				to: "/dashboard/customer",
				ignoreBlocker:true,
			});
		}
	});

	useEffect(() => {
		if (customer && !isNew) {
			form.reset({
				fullName: customer.fullName,
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
			<h1 className="text-3xl font-bold">{isNew ? "สร้างลูกค้าใหม่" : "แก้ไขข้อมูลลูกค้า"}</h1>
			<form.AppForm>
				<form onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}} className="flex flex-col gap-4">
					<form.AppField
						name="fullName"
						children={(field) => <field.TextField label="ชื่อลูกค้า" />}
					/>

					<form.AppField
						name="phone"
						children={(field) => <field.TextField label="โทรศัพท์" />}
					/>

					<form.AppField
						name="notes"
						children={(field) => <field.TextAreaField label="หมายเหตุ" />}
					/>

					<form.FooterBar/>
				</form>
			</form.AppForm>

		</>
	);
}
