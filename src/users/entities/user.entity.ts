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

  // constructor(user: Partial<User>) {
  //   this.id = user?.id;
  //   this.name = user?.name;
  //   this.email = user?.email;
  //   this.username = user?.username;
  //   this.password = user?.password;
  //   this.enabled = user?.enabled;
  //   this.description = user?.description;
  //   this.updatedAt = user?.updatedAt;
  //   this.createdAt = user?.createdAt;
  // }
}
