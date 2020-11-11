import { CanActivate, UseGuards } from '@nestjs/common'

export const Guards = UseGuards

export const Guard = (guard: Function | CanActivate) => Guards(guard)
