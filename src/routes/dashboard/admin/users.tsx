import { createFileRoute } from '@tanstack/react-router'
import { useAdminUsers, useCreateAdminUser, useUpdateUserRole, useChangeUserPassword, useBanUser, type User } from '@/data/admin';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useTable } from '@/hooks/use-table';

export const Route = createFileRoute('/dashboard/admin/users')({
	component: RouteComponent,
})

function RouteComponent() {
	const { data: users, isLoading } = useAdminUsers();
	const createUserMutation = useCreateAdminUser();
	const { searchQuery, sortBy, sortField, handleSearchChange, handleSortChange } = useTable();

	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: 'user',
	});

	const handleCreateUser = async () => {
		await createUserMutation.mutateAsync(formData);
		setFormData({ name: '', email: '', password: '', role: 'user' });
		setOpenCreateDialog(false);
	};

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: "name",
			header: "ชื่อ",
		},
		{
			accessorKey: "email",
			header: "อีเมล",
		},
		{
			accessorKey: "role",
			header: "บทบาท",
		},
		{
			accessorKey: "banned",
			header: "สถานะแบน",
			cell: ({ row }) => row.original.banned ? 'ถูกแบน' : 'ปกติ',
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
				<UserActions user={row.original} />
			),
		},
	];

	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">จัดการผู้ใช้</h1>
				</div>
				<Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
					<DialogTrigger asChild>
						<Button>
							<Plus />
							เพิ่มผู้ใช้ใหม่
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>สร้างผู้ใช้ใหม่</DialogTitle>
							<DialogDescription>
								กรุณากรอกข้อมูลของผู้ใช้ใหม่
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">ชื่อ</label>
								<Input
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder="ชื่อ"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">อีเมล</label>
								<Input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									placeholder="อีเมล"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
								<Input
									type="password"
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									placeholder="รหัสผ่าน"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">บทบาท</label>
								<Input
									value={formData.role}
									onChange={(e) => setFormData({ ...formData, role: e.target.value })}
									placeholder="เช่น admin, user"
								/>
							</div>
							<Button
								onClick={handleCreateUser}
								disabled={createUserMutation.isPending}
								className="w-full"
							>
								{createUserMutation.isPending ? 'กำลังสร้าง...' : 'สร้างผู้ใช้'}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<DataTable
				columns={columns}
				data={users || []}
				searchKey="name"
				searchPlaceholder="ค้นหาผู้ใช้..."
				isLoading={isLoading}
				emptyMessage="ไม่พบผู้ใช้"
				onSearchChange={handleSearchChange}
				onSortChange={handleSortChange}
				searchValue={searchQuery}
				sortField={sortField}
				sortDirection={sortBy}
				showPagination={false}
			/>
		</>
	)
}

function UserActions({ user }: { user: User }) {
	const [openRoleDialog, setOpenRoleDialog] = useState(false);
	const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
	const [openBanDialog, setOpenBanDialog] = useState(false);

	const [newRole, setNewRole] = useState(user.role || 'user');
	const [newPassword, setNewPassword] = useState('');
	const [banReason, setBanReason] = useState(user.banReason || '');
	const [banExpires, setBanExpires] = useState('');

	const updateRoleMutation = useUpdateUserRole(user.id);
	const changePasswordMutation = useChangeUserPassword(user.id);
	const banUserMutation = useBanUser(user.id);

	const handleUpdateRole = async () => {
		await updateRoleMutation.mutateAsync(newRole);
		setOpenRoleDialog(false);
	};

	const handleChangePassword = async () => {
		await changePasswordMutation.mutateAsync(newPassword);
		setNewPassword('');
		setOpenPasswordDialog(false);
	};

	const handleToggleBan = async () => {
		await banUserMutation.mutateAsync({
			banned: !user.banned,
			reason: banReason,
			expiresAt: banExpires,
		});
		setOpenBanDialog(false);
	};

	return (
		<div className="flex items-center gap-2">
			<Dialog open={openRoleDialog} onOpenChange={setOpenRoleDialog}>
				<DialogTrigger asChild>
					<Button size="sm" variant="outline">
						<Edit className="size-4" />
						บทบาท
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>เปลี่ยนบทบาท</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							value={newRole}
							onChange={(e) => setNewRole(e.target.value)}
							placeholder="บทบาท"
						/>
						<Button
							onClick={handleUpdateRole}
							disabled={updateRoleMutation.isPending}
							className="w-full"
						>
							{updateRoleMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
				<DialogTrigger asChild>
					<Button size="sm" variant="outline">
						<Edit className="size-4" />
						รหัสผ่าน
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="รหัสผ่านใหม่"
						/>
						<Button
							onClick={handleChangePassword}
							disabled={changePasswordMutation.isPending}
							className="w-full"
						>
							{changePasswordMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={openBanDialog} onOpenChange={setOpenBanDialog}>
				<DialogTrigger asChild>
					<Button size="sm" variant={user.banned ? "default" : "destructive"}>
						<Trash2 className="size-4" />
						{user.banned ? 'ปลดแบน' : 'แบน'}
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{user.banned ? 'ปลดแบนผู้ใช้' : 'แบนผู้ใช้'}</DialogTitle>
					</DialogHeader>
					{!user.banned && (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">เหตุผลการแบน</label>
								<Input
									value={banReason}
									onChange={(e) => setBanReason(e.target.value)}
									placeholder="เหตุผล"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">วันหมดอายุการแบน (ไม่บังคับ)</label>
								<Input
									type="datetime-local"
									value={banExpires}
									onChange={(e) => setBanExpires(e.target.value)}
								/>
							</div>
						</div>
					)}
					<Button
						onClick={handleToggleBan}
						disabled={banUserMutation.isPending}
						variant={user.banned ? "default" : "destructive"}
						className="w-full"
					>
						{banUserMutation.isPending ? 'กำลังบันทึก...' : (user.banned ? 'ปลดแบน' : 'แบน')}
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	)
}
