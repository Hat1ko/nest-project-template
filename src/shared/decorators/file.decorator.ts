import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes } from '@nestjs/swagger'

export const UploadFile = (fileField: string = 'file') =>
  applyDecorators(ApiConsumes('multipart/form-data'), UseInterceptors(FileInterceptor(fileField)))
