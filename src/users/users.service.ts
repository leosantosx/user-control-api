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
      return new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const emailAlreadyExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (emailAlreadyExists) {
      return new HttpException('E-mail already exists', HttpStatus.CONFLICT);
    }

    const createdUser = await this.prisma.user.create({
      data: {
        ...data,
        password: await hash(data.password, 10),
      },
    });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findAll(): Promise<UpdateUserDto[]> {
    return await this.prisma.user.findMany({
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

  async update(id: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
    const userExists = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const data: Prisma.UserUpdateInput = {
      ...dto,
    };

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return {
      ...updatedUser,
      password: undefined,
    };
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
