import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';
import { UsersService } from './users.service';

const userId = v4();
const users = [
  {
    id: userId,
    name: 'test',
    email: 'test@gmail.com',
    username: 'test',
    password: 'test',
    enabled: false,
    description: '',
  },
];

const oneUser = users[0];

const db = {
  user: {
    findMany: jest.fn().mockResolvedValue(users),
    findFirst: jest.fn().mockResolvedValue(oneUser),
    create: jest.fn().mockReturnValue([]),
    update: jest.fn().mockResolvedValue(oneUser),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(UsersService).toBeDefined();
    expect(PrismaService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should get a single user', () => {
      expect(service.findOne('a uuid')).resolves.toEqual(oneUser);
    });
  });

  describe('delete', () => {
    it('should delete an user', () => {
      expect(service.delete('a uuid')).toBeTruthy();
    });
  });

  describe('update', () => {
    it('should successfully update an user', async () => {
      const user = await service.update('a uuid', {
        email: 'new_user@gmail.com',
        username: 'test',
        enabled: false,
        description: '',
      });
      expect(user).toEqual({ ...oneUser, password: undefined });
    });
  });

  describe('create', () => {
    it('should create an user', async () => {
      const user = await service.create({
        name: 'string',
        email: 'string',
        username: 'string',
        password: 'string',
      });

      expect(user).toBeDefined();
    });
  });
});
