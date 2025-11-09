import { useQuery } from "@tanstack/react-query"
import { useEden } from "@/data/api"

export function useAppVersion() {
	const eden = useEden()

	return useQuery({
		queryKey: [
			"version"
		],
		queryFn: async () => {
			const { data, error } = await eden.get()
			if (error) throw error
			return data
		}
	})
}
