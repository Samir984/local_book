/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import client from '@kubb/plugin-client/clients/axios'
import type { CoreApiListUserBooksQueryResponse, CoreApiListUserBooksQueryParams } from '../types/CoreApiListUserBooks.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, QueryClient, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const coreApiListUserBooksQueryKey = (params?: CoreApiListUserBooksQueryParams) =>
  [{ url: '/api/v1/books/current-users/' }, ...(params ? [params] : [])] as const

export type CoreApiListUserBooksQueryKey = ReturnType<typeof coreApiListUserBooksQueryKey>

/**
 * @description Get user book
 * @summary List User Books
 * {@link /api/v1/books/current-users/}
 */
export async function coreApiListUserBooks(params?: CoreApiListUserBooksQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CoreApiListUserBooksQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: `/api/v1/books/current-users/`,
    params,
    ...requestConfig,
  })
  return res.data
}

export function coreApiListUserBooksQueryOptions(params?: CoreApiListUserBooksQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = coreApiListUserBooksQueryKey(params)
  return queryOptions<CoreApiListUserBooksQueryResponse, ResponseErrorConfig<Error>, CoreApiListUserBooksQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return coreApiListUserBooks(params, config)
    },
  })
}

/**
 * @description Get user book
 * @summary List User Books
 * {@link /api/v1/books/current-users/}
 */
export function useCoreApiListUserBooks<
  TData = CoreApiListUserBooksQueryResponse,
  TQueryData = CoreApiListUserBooksQueryResponse,
  TQueryKey extends QueryKey = CoreApiListUserBooksQueryKey,
>(
  params?: CoreApiListUserBooksQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<CoreApiListUserBooksQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>> & {
      client?: QueryClient
    }
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: { client: queryClient, ...queryOptions } = {}, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? coreApiListUserBooksQueryKey(params)

  const query = useQuery(
    {
      ...(coreApiListUserBooksQueryOptions(params, config) as unknown as QueryObserverOptions),
      queryKey,
      ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
    },
    queryClient,
  ) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}