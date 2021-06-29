import { mocked } from 'ts-jest/utils';
import { DEFAULT_PREFIX } from '../../shared/constants';
import { prisma } from '../prismaClient';
import { forPrefix, redis } from '../redisClient';
import { GuildProvider } from './guildProvider';
jest.mock('../redisClient');

const mockRedis = mocked(redis, true);

const guildProvider = new GuildProvider(prisma, mockRedis);

afterAll(() => prisma.$disconnect());

describe('#getPrefix', () => {
  const findUnique = jest.spyOn(prisma.guild, 'findUnique');

  afterAll(() => {
    findUnique.mockRestore();
  });

  describe('prefix is cached', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValue('prefix');
    });
    afterEach(() => {
      mockRedis.expire.mockClear();
      findUnique.mockClear();
    });

    mockRedis.get.mockResolvedValue('prefix');
    test('prisma should not be called', async () => {
      await guildProvider.getPrefix('guild-id');
      expect(findUnique).not.toBeCalled();
    });
    test('redis should extend ttl', async () => {
      await guildProvider.getPrefix('guild-id');
      expect(mockRedis.expire).toBeCalledWith(forPrefix('guild-id'), 60);
    });
    test('should return the cached prefix', async () => {
      const prefix = await guildProvider.getPrefix('guild-id');
      expect(prefix).toBe('prefix');
    });
  });

  describe('prefix is not cached', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValue(null);
    });
    afterEach(() => {
      mockRedis.set.mockClear();
      findUnique.mockClear();
    });

    test('prisma should be called', async () => {
      findUnique.mockResolvedValueOnce({} as any);
      await guildProvider.getPrefix('guild-id');
      expect(findUnique).toBeCalledTimes(1);
    });

    describe('and got result from db', () => {
      beforeEach(() => {
        findUnique.mockResolvedValue({
          prefix: 'prefix',
        } as any);
      });

      test('should cache in redis', async () => {
        await guildProvider.getPrefix('guild-id');
        expect(mockRedis.set).toBeCalledWith(
          forPrefix('guild-id'),
          'prefix',
          'ex',
          60,
        );
      });
      test('returns the prefix', async () => {
        const prefix = await guildProvider.getPrefix('guild-id');
        expect(prefix).toBe('prefix');
      });
    });
    describe('and could not get results from db', () => {
      beforeEach(() => {
        findUnique.mockResolvedValue({} as any); // no prefix set
      });

      test('returns the default prefix', async () => {
        const prefix = await guildProvider.getPrefix('guild-id');
        expect(prefix).toBe(DEFAULT_PREFIX);
      });
      test('caches the default prefix in redis', async () => {
        await guildProvider.getPrefix('guild-id');
        expect(mockRedis.set).toBeCalledWith(
          forPrefix('guild-id'),
          DEFAULT_PREFIX,
          'ex',
          60,
        );
      });
    });
  });
});

describe('#setPrefix', () => {
  const guildId = 'g';
  const upsert = jest.spyOn(prisma.guild, 'upsert');

  afterEach(async () => {
    await prisma.guild.deleteMany();
    upsert.mockClear();
  });

  afterAll(() => {
    upsert.mockRestore();
  });

  test('caches in redis', async () => {
    await guildProvider.setPrefix('guild-id', 'p');
    expect(mockRedis.set).toBeCalledWith(forPrefix('guild-id'), 'p', 'ex', 60);
  });
  test('uses upsert', async () => {
    await guildProvider.setPrefix('guild-id', 'p');
    expect(upsert).toBeCalledTimes(1);
  });

  describe('guild does not exist', () => {
    test('inserts the guild', async () => {
      // ensure the guild does not exist
      const _guild = await prisma.guild.findUnique({ where: { guildId } });
      expect(_guild).toBeNull;

      await guildProvider.setPrefix(guildId, 'p');
      const guild = await prisma.guild.findUnique({
        where: { guildId },
        select: { prefix: true },
      });
      expect(guild?.prefix).toBe('p');
    });
  });

  describe('guild exists', () => {
    test('updates the guild', async () => {
      await prisma.guild.create({ data: { guildId, prefix: 'a' } });
      await guildProvider.setPrefix(guildId, 'b');
      const res = await prisma.guild.findUnique({
        where: { guildId },
        select: { prefix: true },
      });
      expect(res?.prefix).toBe('b');
    });
  });
});
