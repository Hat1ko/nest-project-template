import { Type } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export const DocResponse = (
  description?: string,
  type?: string | Function | Type<any> | [Function],
  status: number = 200,
) => ApiResponse({ status, description, type })

export const DocSuccess = (
  description: string = 'Success',
  type?: string | Function | Type<any> | [Function],
  status: number = 200,
) => DocResponse(description, type, status)
