/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { GenericSchema } from './GenericSchema.ts'
import type { S3GetSignedObjectURLScehma } from './S3GetSignedObjectURLScehma.ts'

export type CoreApiGetFileUrlQueryParams = {
  /**
   * @type string
   */
  key: string
}

/**
 * @description OK
 */
export type CoreApiGetFileUrl200 = S3GetSignedObjectURLScehma

/**
 * @description Not Found
 */
export type CoreApiGetFileUrl404 = GenericSchema

export type CoreApiGetFileUrlQueryResponse = CoreApiGetFileUrl200

export type CoreApiGetFileUrlQuery = {
  Response: CoreApiGetFileUrl200
  QueryParams: CoreApiGetFileUrlQueryParams
  Errors: CoreApiGetFileUrl404
}