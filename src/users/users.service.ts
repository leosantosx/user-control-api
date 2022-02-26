import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
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

    return await this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
