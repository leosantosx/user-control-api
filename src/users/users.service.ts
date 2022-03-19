import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<Partial<User>> {
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
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        enabled: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(): Promise<Partial<User[]>> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const userExists = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

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

  async delete(id: string): Promise<void> {
    const userExists = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return;
  }
}
