import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException
} from "@nestjs/common";

export const badRequestException = new BadRequestException('Bad Request')
export const invalidActivationCodeException = new BadRequestException('Invalid activation code')
export const userByEmailNotFoundedException = new NotFoundException(
    'User with this email not found',
)
export const invalidUserRoleException = new InternalServerErrorException('Invalid user role')
export const userAlreadyExistException = new ConflictException('User already exists')
export const failedToCreateUserException = new InternalServerErrorException('Failed to create User')
export const failedToCreateClientException = new InternalServerErrorException(
    'Failed to create Candidate',
)
export const notFoundException = (name: string) => new NotFoundException(`${name} not found`)
export const notImplementedException = new NotImplementedException('Not implemented')
