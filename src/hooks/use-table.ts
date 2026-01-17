import { useState } from 'react';
import { useDebounce } from './use-debounce';

export interface UseTableOptions {
	initialSort?: 'asc' | 'desc';
	initialSearch?: string;
	debounceMs?: number;
}

export function useTable(options: UseTableOptions = {}) {
	const [cursor, setCursor] = useState<string | undefined>();
	const [searchQuery, setSearchQuery] = useState<string>(options.initialSearch || "");
	const [sortBy, setSortBy] = useState<'asc' | 'desc'>(options.initialSort || "desc");
	const [sortField, setSortField] = useState<string | undefined>();

	const debouncedSearchQuery = useDebounce(searchQuery, options.debounceMs || 300);

	const handlePaginationChange = (newCursor: string | undefined) => {
		setCursor(newCursor);
	};

	const handleSearchChange = (search: string) => {
		setSearchQuery(search);
		setCursor(undefined);
	};

	const handleSortChange = (field: string | undefined, direction: 'asc' | 'desc') => {
		setSortField(field);
		setSortBy(direction);
		setCursor(undefined);
	};

	const resetTable = () => {
		setCursor(undefined);
		setSearchQuery(options.initialSearch || "");
		setSortBy(options.initialSort || "desc");
	};

	return {
		cursor,
		searchQuery,
		debouncedSearchQuery,
		sortBy,
		sortField,
		handlePaginationChange,
		handleSearchChange,
		handleSortChange,
		resetTable,
	};
}
