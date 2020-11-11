import { applyDecorators, HttpException } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { globalExceptions } from '../../core/constants/global'

export const DocThrows = (exception: HttpException) =>
  ApiResponse({ status: exception.getStatus(), description: exception.message })

export const DocThrowsMany = (exceptions?: HttpException[]) => {
  if (!exceptions) exceptions = []

  exceptions = [...globalExceptions, ...exceptions]

  const throws: { [key: string]: HttpException[] } = {}

  exceptions.map(e => {
    const status = e.getStatus()
    if (!throws[status]) throws[status] = []
    throws[status].push(e)
  })

  const exceptionsRes: HttpException[] = []

  // tslint:disable-next-line: forin
  for (let status in throws) {
    const errors = throws[status]
    exceptionsRes.push(
      new HttpException(errors.map(e => e.message).join('; '), parseInt(status, 10)),
    )
  }

  return applyDecorators(...exceptionsRes.map(e => DocThrows(e)))
}
