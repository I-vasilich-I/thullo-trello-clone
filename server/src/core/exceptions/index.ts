import { BadRequestException } from '@nestjs/common';

export class InvalidActivationLinkException extends BadRequestException {
  constructor() {
    super('Invalid activation link');
  }
}

export class UserAlreadyExistException extends BadRequestException {
  constructor(email: string) {
    super(`User with email: ${email} already exist`);
  }
}
