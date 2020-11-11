import { createParamDecorator } from '@nestjs/common'

export const ReqUserId = createParamDecorator((data: string, req) => {
  return req.args[0].user ? req.args[0].user.id : null
})
