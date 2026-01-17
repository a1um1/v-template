import { createFileRoute, Link } from '@tanstack/react-router'
import { useCustomers, useDeleteCustomer } from '@/data/customer';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTable } from '@/hooks/use-table';

export const Route = createFileRoute('/dashboard/customer/')({
	component: RouteComponent,
})

type Customer = {
	id: string;
	fullName: string;
	email: string;
	phone?: string | null;
	notes?: string | null;
	createdAt: Date;
	updatedAt: Date;
};

function RouteComponent() {
	const { cursor, searchQuery, debouncedSearchQuery, sortBy, sortField, handlePaginationChange, handleSearchChange, handleSortChange } = useTable({ initialSort: 'desc' });
	const { data, isLoading } = useCustomers({ cursor, q: debouncedSearchQuery, direction: sortBy, sortBy: sortField });
	const deleteMutation = useDeleteCustomer();

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this customer?")) {
			await deleteMutation.mutateAsync(id);
		}
	};

	const columns: ColumnDef<Customer>[] = [
		{
			accessorKey: "fullName",
			header: "ชื่อ",
		},
		{
			accessorKey: "email",
			header: "อีเมล",
		},
		{
			accessorKey: "phone",
			header: "โทรศัพท์",
			cell: ({ row }) => row.original.phone || "-",
		},
		{
			accessorKey: "createdAt",
			header: "วันที่สร้าง",
			cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
		},
		{
			id: "actions",
			header: "ดำเนินการ",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						asChild
					>
						<Link to="/dashboard/customer/$id" params={{ id: row.original.id }}>
							<Pencil /> แก้ไข
						</Link>
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => handleDelete(row.original.id)}
						disabled={deleteMutation.isPending}
					>
						<Trash2 /> ลบ
					</Button>
				</div>
			),
		},
	];

	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">รายการลูกค้า</h1>
				</div>
				<Button asChild>
					<Link to="/dashboard/customer/$id" params={{ id: "new" }}>
						<Plus />
						เพิ่มรายชื่อลูกค้า
					</Link>
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={data?.data || []}
				searchKey="fullName"
				searchPlaceholder="ค้นหาด้วยชื่อ..."
				isLoading={isLoading}
				emptyMessage="ไม่พบลูกค้า"
				onPaginationChange={handlePaginationChange}
				onSearchChange={handleSearchChange}
				onSortChange={handleSortChange}
				nextCursor={data?.nextCursor}
				showPagination={true}
				searchValue={searchQuery}
				sortField={sortField}
				sortDirection={sortBy}
			/>
		</>
	)
}
