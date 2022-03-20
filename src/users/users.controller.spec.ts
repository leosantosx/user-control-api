import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userId = v4();
const mockedUsers = [
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

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockedUsers),
            findOne: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve(mockedUsers[0]),
              ),
            create: jest.fn().mockImplementation((user: CreateUserDto) =>
              Promise.resolve({
                id: userId,
                ...user,
              }),
            ),
            update: jest
              .fn()
              .mockImplementation((id: string, user: UpdateUserDto) =>
                Promise.resolve({
                  id: userId,
                  ...user,
                }),
              ),
            delete: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should get an array of users', async () => {
      await expect(usersController.findAll()).resolves.toEqual(mockedUsers);
    });
  });

  describe('findOneUser', () => {
    it('should get a single user', async () => {
      await expect(usersController.findOne(userId)).resolves.toEqual(
        mockedUsers[0],
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser: CreateUserDto = {
        name: 'New user',
        email: 'test@gmail.com',
        username: 'test123',
        description: 'test',
        password: '@test123',
      };
      await expect(usersController.create(newUser)).resolves.toEqual({
        id: userId,
        ...newUser,
      });
    });
  });

  describe('updateUser', () => {
    it('should update an user', async () => {
      const newUser: CreateUserDto = {
        name: 'New user',
        email: 'test@gmail.com',
        username: 'test123',
        description: 'test',
        password: '@test123',
      };
      await expect(usersController.update(userId, newUser)).resolves.toEqual({
        id: userId,
        ...newUser,
      });
    });
  });

  describe('deleteOneUser', () => {
    it('should return that it deleted an user', async () => {
      await expect(
        usersController.delete('a uuid that exists'),
      ).resolves.toEqual({
        deleted: true,
      });
    });
  });
});
