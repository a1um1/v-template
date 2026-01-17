import { Treaty, treaty } from "@elysiajs/eden"
import { type App } from "@server/index"
import {
  type QueryKey,
  type UseQueryOptions,
  useQuery as useTanstackQuery,
  type UseQueryResult
} from '@tanstack/react-query'

const url = new URL(
	import.meta.env.VITE_API_URL || "http://localhost:3000/"
)

export const eden =  treaty<App>(url.host).api

export function useEdenQuery<
  T extends Record<number, unknown> = Record<number, unknown>
>(
  queryKey: QueryKey,
  treatyFn: () => Promise<Treaty.TreatyResponse<T>>,
  options?: Omit<
    UseQueryOptions<
      Treaty.Data<Treaty.TreatyResponse<T>>,
      Treaty.Error<Treaty.TreatyResponse<T>>
    >,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<
  Treaty.Data<Treaty.TreatyResponse<T>>,
  Treaty.Error<Treaty.TreatyResponse<T>>
> {
  return useTanstackQuery<
    Treaty.Data<Treaty.TreatyResponse<T>>,
    Treaty.Error<Treaty.TreatyResponse<T>>
  >({
    queryKey,
    queryFn: async () => {
      const response = await treatyFn()
      if (response.error) throw response.error
      if (response.data !== undefined)  return response.data as Treaty.Data<Treaty.TreatyResponse<T>>
      throw new Error('No data returned from API')
    },
    ...options
  })
}
