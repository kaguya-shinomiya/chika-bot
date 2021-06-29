import { User } from 'discord.js';
import { mock } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import { prisma } from '../prismaClient';
import { forRibbons, redis } from '../redisClient';
import { UserProvider } from './userProvider';
jest.mock('../redisClient');

const mockRedis = mocked(redis, true);

const userProvider = new UserProvider(prisma, mockRedis);

describe('#getRibbons', () => {
  const user = mock<User>();
  user.id = '1';
  const findUnique = jest.spyOn(prisma.user, 'findUnique');

  afterEach(() => {
    findUnique.mockReset();
    mockRedis.get.mockReset();
  });

  afterAll(() => {
    findUnique.mockRestore();
  });

  test('should search in redis', async () => {
    await userProvider.getRibbons(user as any);
    expect(mockRedis.get).toBeCalledTimes(1);
  });

  describe('found in cache', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce('420');
    });
    test('should not hit db', async () => {
      await userProvider.getRibbons(user as any);
      expect(findUnique).not.toBeCalled();
    });
    test('should return value given by redis', async () => {
      const res = await userProvider.getRibbons(user as any);
      expect(res).toBe(420);
    });
    test('should extend ttl by 60 seconds', async () => {
      await userProvider.getRibbons(user as any);
      expect(mockRedis.expire).toBeCalledWith(forRibbons(user.id), 60);
    });
  });

  describe('not in cache', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce(null);
    });
    test('should hit the db', async () => {
      findUnique.mockResolvedValueOnce({} as any);
      await userProvider.getRibbons(user as any);
      expect(findUnique).toBeCalledTimes(1);
    });
    describe('found in db', () => {
      beforeEach(() => {
        findUnique.mockResolvedValueOnce({ ribbons: 420 } as any);
      });
      test('should return the value from db', async () => {
        const res = await userProvider.getRibbons(user as any);
        expect(res).toBe(420);
      });
      test('should cache the retrieved value', async () => {
        await userProvider.getRibbons(user as any);
        expect(mockRedis.set).toBeCalledWith(
          forRibbons(user.id),
          420,
          'ex',
          60,
        );
      });
    });
    describe('not found in db', () => {
      beforeEach(() => {
        findUnique.mockResolvedValueOnce({} as any);
      });
      test('returns 0', async () => {
        const res = await userProvider.getRibbons(user as any);
        expect(res).toBe(0);
      });
      test('caches 0', async () => {
        await userProvider.getRibbons(user as any);
        expect(mockRedis.set).toBeCalledWith(forRibbons(user.id), 0, 'ex', 60);
      });
    });
  });
});
