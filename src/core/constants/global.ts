import { badRequestException } from './exceptions'
// import { InactiveUserGuard } from '../guards/inactive-user.guard'

export const globalExceptions = [badRequestException]

export const globalAccessGuards = [
  // InactiveUserGuard
]
