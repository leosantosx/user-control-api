import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = {
      ...dto,
    };

    const usernameAlreadyExists = await this.prisma.user.findFirst({
      where: {
        username: {
          mode: 'insensitive',
          equals: data.username,
        },
      },
    });

    if (usernameAlreadyExists) {
      throw new Error('Username already exists');
    }

    const emailAlreadyExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (emailAlreadyExists) {
      throw new Error('E-mail already exists');
    }

    const passwordHash = await hash(data.password, 10);

    return await this.prisma.user.create({
      data: {
        ...data,
        password: passwordHash,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: string, dto: UpdateUserDto) {
    const data: Prisma.UserUpdateInput = {
      ...dto,
    };
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    const userExists = await this.prisma.user.findFirst({
      where: { id },
    });
    console.log(userExists);

    if (!userExists) {
      throw new HttpException('User does not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return;
  }
}
