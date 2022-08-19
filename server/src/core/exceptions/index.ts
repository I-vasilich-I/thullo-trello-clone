import { BadRequestException } from '@nestjs/common';

export class InvalidActivationLinkException extends BadRequestException {
  constructor() {
    super('Invalid activation link');
  }
}
