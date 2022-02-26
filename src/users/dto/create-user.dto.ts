import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  name: string;
  email: string;
  username: string;
  password: string;
  enabled?: boolean;
  description?: string;
}
