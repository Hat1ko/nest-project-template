import { Type } from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'

export const DocAcceptsBody = (type?: string | Function | Type<any> | [Function]) =>
  ApiBody({ type })
