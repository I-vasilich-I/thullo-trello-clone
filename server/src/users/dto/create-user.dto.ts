import { RegisterUserDto } from './register-user.dto';

export type CreateUserDto = Omit<RegisterUserDto, 'userName'>;
