import { Prisma } from '@prisma/client';

export class User implements Prisma.UserUncheckedCreateInput {
  id?: string;
  name: string;
  email: string;
  username: string;
  password: string;
  enabled?: boolean;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
