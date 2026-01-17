import { DataTable } from '@/components/data-table';
import { AlertConfirm } from '@/components/modal/alert';
import { Button } from '@/components/ui/button';
import { useCustomers, useDeleteCustomer } from '@/data/customer';
import { useTable } from '@/hooks/use-table';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/dashboard/customer/')({
	component: RouteComponent,
})


function RouteComponent() {
	const { cursor, searchQuery, debouncedSearchQuery, sortBy, sortField, handlePaginationChange, handleSearchChange, handleSortChange } = useTable({ initialSort: 'desc' });
	const { data, isLoading } = useCustomers({ cursor, q: debouncedSearchQuery, direction: sortBy, sortBy: sortField });
	const deleteMutation = useDeleteCustomer();

	const handleDelete = async (id: string) => {
		if (await AlertConfirm.call({ message: "คุณแน่ใจหรือไม่ที่จะลบลูกค้ารายนี้?" })) {
			await deleteMutation.mutateAsync(id);
		}
	};

	const columns: ColumnDef<NonNullable<typeof data>["data"][number]>[] = [
		{
			accessorKey: "fullName",
			header: "ชื่อ",
		},
		{
			accessorKey: "phone",
			header: "โทรศัพท์",
		},
		{
			accessorKey: "createdAt",
			header: "วันที่สร้าง",
			meta: { type: 'datetime' },
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
					<h1 className="text-3xl font-bold">รายการลูกค้า</h1>
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
