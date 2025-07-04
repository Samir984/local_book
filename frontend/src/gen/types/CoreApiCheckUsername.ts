/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { GenericSchema } from './GenericSchema.ts'

export type CoreApiCheckUsernameQueryParams = {
  /**
   * @type string
   */
  username: string
}

/**
 * @description OK
 */
export type CoreApiCheckUsername200 = GenericSchema

/**
 * @description Bad Request
 */
export type CoreApiCheckUsername400 = GenericSchema

export type CoreApiCheckUsernameQueryResponse = CoreApiCheckUsername200

export type CoreApiCheckUsernameQuery = {
  Response: CoreApiCheckUsername200
  QueryParams: CoreApiCheckUsernameQueryParams
  Errors: CoreApiCheckUsername400
}