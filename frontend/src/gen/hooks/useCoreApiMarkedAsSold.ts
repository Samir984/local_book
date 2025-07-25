/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import client from '@kubb/plugin-client/clients/axios'
import type {
  CoreApiMarkedAsSoldMutationResponse,
  CoreApiMarkedAsSoldPathParams,
  CoreApiMarkedAsSold400,
  CoreApiMarkedAsSold403,
  CoreApiMarkedAsSold404,
} from '../types/CoreApiMarkedAsSold.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions, QueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

export const coreApiMarkedAsSoldMutationKey = () => [{ url: '/api/v1/books/mark-as-sold/{id}/' }] as const

export type CoreApiMarkedAsSoldMutationKey = ReturnType<typeof coreApiMarkedAsSoldMutationKey>

/**
 * @summary Marked As Sold
 * {@link /api/v1/books/mark-as-sold/:id/}
 */
export async function coreApiMarkedAsSold(id: CoreApiMarkedAsSoldPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<
    CoreApiMarkedAsSoldMutationResponse,
    ResponseErrorConfig<CoreApiMarkedAsSold400 | CoreApiMarkedAsSold403 | CoreApiMarkedAsSold404>,
    unknown
  >({ method: 'PATCH', url: `/api/v1/books/mark-as-sold/${id}/`, ...requestConfig })
  return res.data
}

/**
 * @summary Marked As Sold
 * {@link /api/v1/books/mark-as-sold/:id/}
 */
export function useCoreApiMarkedAsSold<TContext>(
  options: {
    mutation?: UseMutationOptions<
      CoreApiMarkedAsSoldMutationResponse,
      ResponseErrorConfig<CoreApiMarkedAsSold400 | CoreApiMarkedAsSold403 | CoreApiMarkedAsSold404>,
      { id: CoreApiMarkedAsSoldPathParams['id'] },
      TContext
    > & { client?: QueryClient }
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: { client: queryClient, ...mutationOptions } = {}, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? coreApiMarkedAsSoldMutationKey()

  return useMutation<
    CoreApiMarkedAsSoldMutationResponse,
    ResponseErrorConfig<CoreApiMarkedAsSold400 | CoreApiMarkedAsSold403 | CoreApiMarkedAsSold404>,
    { id: CoreApiMarkedAsSoldPathParams['id'] },
    TContext
  >(
    {
      mutationFn: async ({ id }) => {
        return coreApiMarkedAsSold(id, config)
      },
      mutationKey,
      ...mutationOptions,
    },
    queryClient,
  )
}