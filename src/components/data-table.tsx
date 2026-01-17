import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey?: keyof TData;
	searchPlaceholder?: string;
	isLoading?: boolean;
	emptyMessage?: string;
	onPaginationChange?: (cursor: string | undefined, limit: number) => void;
	onSearchChange?: (search: string) => void;
	onSortChange?: (sortBy: string | undefined, direction: 'asc' | 'desc') => void;
	nextCursor?: string;
	showPagination?: boolean;
	pageSize?: number;
	searchValue?: string;
	sortField?: string;
	sortDirection?: 'asc' | 'desc';
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchPlaceholder = "ค้นหารายการ",
	isLoading = false,
	emptyMessage = "ไม่พบผลลัพธ์",
	onPaginationChange,
	onSearchChange,
	onSortChange,
	nextCursor,
	showPagination = true,
	pageSize = 20,
	searchValue: externalSearchValue,
	sortField,
	sortDirection,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [internalSearchValue, setInternalSearchValue] = useState("");
	const searchValue = externalSearchValue ?? internalSearchValue;
	const [currentCursor, setCurrentCursor] = useState<string | undefined>();
	const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			sorting,
		},
		onSortingChange: setSorting,
	});

	const handleSearch = (value: string) => {
		if (externalSearchValue === undefined) {
			setInternalSearchValue(value);
		}
		onSearchChange?.(value);
	};

	const handleSort = (columnId: string) => {
		const currentSort = sorting[0];
		const isAsc = currentSort?.id === columnId && currentSort?.desc === false;
		const newDirection = isAsc ? 'asc' : 'desc';
		const newSorting: SortingState = columnId ? [{ id: columnId, desc: isAsc }] : [];
		setSorting(newSorting);
		onSortChange?.(columnId || undefined, isAsc ? 'desc' : 'asc');
	};

	const handleNextPage = () => {
		if (nextCursor && onPaginationChange) {
			setCursorHistory((prev) => [...prev, currentCursor]);
			setCurrentCursor(nextCursor);
			onPaginationChange(nextCursor, pageSize);
		}
	};

	const handlePreviousPage = () => {
		if (cursorHistory.length > 0 && onPaginationChange) {
			const newHistory = [...cursorHistory];
			const previousCursor = newHistory.pop();
			setCursorHistory(newHistory);
			setCurrentCursor(previousCursor);
			onPaginationChange(previousCursor, pageSize);
		}
	};

	const canGoPrevious = cursorHistory.length > 0;
	const canGoNext = !!nextCursor;

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="ค้นหารายการ"
						value={searchValue}
						onChange={(e) => handleSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const isSortable = header.column.columnDef.enableSorting !== false && header.id !== 'actions';
									const isCurrentSort = sortField === header.id;
									return (
										<TableHead key={header.id} className={isSortable ? 'cursor-pointer select-none' : ''}>
											<div className="flex items-center gap-2" onClick={() => isSortable && handleSort(header.id)}>
												{header.isPlaceholder
													? null
													: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												{isSortable && (
													isCurrentSort ? (
														sortDirection === 'asc' ? (
															<ArrowUp className="size-4 text-primary" />
														) : (
															<ArrowDown className="size-4 text-primary" />
														)
													) : (
														<ArrowUpDown className="size-4 text-muted-foreground" />
													)
												)}
											</div>
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									<div className="flex items-center justify-center">
										<div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{showPagination && onPaginationChange && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						แสดง {data.length} รายการ
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handlePreviousPage}
							disabled={!canGoPrevious || isLoading}
						>
							<ChevronLeft />
							ก่อนหน้า
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleNextPage}
							disabled={!canGoNext || isLoading}
						>
							ถัดไป
							<ChevronRight />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
