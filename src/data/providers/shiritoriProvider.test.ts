import _ from 'lodash';
import { mocked } from 'ts-jest/utils';
import {
  DEFAULT_SHIRITORI_HAND,
  DEFAULT_SHIRITORI_MIN_LEN,
} from '../../games/shiritori/utils/defaults';
import { prisma } from '../prismaClient';
import { forShiritoriHand, forShiritoriMinLen, redis } from '../redisClient';
import { ShiritoriProvider } from './shiritoriProvider';
jest.mock('../redisClient');

const mockRedis = mocked(redis, true);
const shiritoriProvider = new ShiritoriProvider(prisma, mockRedis);

afterEach(async () => {
  await prisma.guild.deleteMany();
  await mockRedis.set.mockReset();
  await mockRedis.expire.mockReset();
});

afterAll(() => prisma.$disconnect());

describe('#setMinLen', () => {
  test('throws if negative minLen provided', async () => {
    return expect(shiritoriProvider.setMinLen('1', -1)).rejects.toThrow();
  });

  test('caches to redis', async () => {
    await shiritoriProvider.setMinLen('1', 1);
    expect(mockRedis.set).toBeCalledWith(forShiritoriMinLen('1'), 1, 'ex', 60);
    mockRedis.set.mockClear();
  });

  describe('guild exists in db', () => {
    beforeEach(async () => {
      await prisma.guild.create({
        data: { guildId: '1', shiritori: { create: { minLen: 1 } } },
      });
    });

    test('update the shiritori minLen', async () => {
      await shiritoriProvider.setMinLen('1', 2);
      const res = await prisma.shiritori.findUnique({
        where: { guildId: '1' },
        select: { minLen: true },
      });
      expect(res?.minLen).toBe(2);
    });
  });

  describe('guild does not exist in db', () => {
    test('creates the guild with minLen', async () => {
      const _guild = await prisma.guild.findUnique({ where: { guildId: '1' } });
      expect(_guild).toBeNull(); // check null

      await shiritoriProvider.setMinLen('1', 1);
      const res = await prisma.shiritori.findUnique({
        where: { guildId: '1' },
        select: { minLen: true },
      });
      expect(res?.minLen).toBe(1);
    });
  });
});

describe('#getMinLen', () => {
  test('returns default if no guild id is given', async () => {
    const res = await shiritoriProvider.getMinLen();
    expect(res).toBe(DEFAULT_SHIRITORI_MIN_LEN);
  });

  describe('found in redis', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce('1');
    });
    afterEach(() => {
      mockRedis.get.mockReset();
    });

    test('returns the value from redis as number', async () => {
      const res = await shiritoriProvider.getMinLen('1');
      expect(res).toBe(1);
    });

    test('extends ttl of key', async () => {
      await shiritoriProvider.getMinLen('1');
      expect(mockRedis.expire).toBeCalledWith(forShiritoriMinLen('1'), 60);
    });
  });

  describe('not in redis', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce(null);
    });

    describe('not in db either', () => {
      test('returns the default value', async () => {
        const _sh = await prisma.shiritori.findUnique({
          where: { guildId: '1' },
        });
        expect(_sh).toBeNull(); // check null

        const res = await shiritoriProvider.getMinLen('1');
        expect(res).toBe(DEFAULT_SHIRITORI_MIN_LEN);
      });

      test('caches the default value', async () => {
        await shiritoriProvider.getMinLen('1');
        expect(mockRedis.set).toBeCalledWith(
          forShiritoriMinLen('1'),
          DEFAULT_SHIRITORI_MIN_LEN,
          'ex',
          60,
        );
      });
    });

    describe('found in db', () => {
      beforeEach(async () => {
        await prisma.guild.create({
          data: { guildId: '1', shiritori: { create: { minLen: 2 } } },
        });
      });

      test('returns the value from the db', async () => {
        const res = await shiritoriProvider.getMinLen('1');
        expect(res).toBe(2);
      });

      test('caches the value', async () => {
        await shiritoriProvider.getMinLen('1');
        expect(mockRedis.set).toBeCalledWith(
          forShiritoriMinLen('1'),
          2,
          'ex',
          60,
        );
      });
    });
  });
});

describe('#setHandSize', () => {
  test('throws if hand size less than 1', () => {
    return expect(shiritoriProvider.setHandSize('1', 0)).rejects.toThrow();
  });

  test('caches to redis', async () => {
    const size = _.random(1, 10);
    await shiritoriProvider.setHandSize('1', size);
    expect(mockRedis.set).toBeCalledWith(forShiritoriHand('1'), size, 'ex', 60);
  });

  describe('guild exists with settings', () => {
    const size = _.random(1, 10);
    beforeEach(async () => {
      await prisma.guild.create({
        data: { guildId: '1', shiritori: { create: { handSize: 1 } } },
      });
    });

    test('updates the settings', async () => {
      await shiritoriProvider.setHandSize('1', size);
      const res = await prisma.shiritori.findUnique({
        where: { guildId: '1' },
        select: { handSize: true },
      });
      expect(res?.handSize).toBe(size);
    });
  });

  describe('guild does not exist in settings', () => {
    const size = _.random(1, 10);
    test('creates guild with handSize', async () => {
      const _sh = await prisma.shiritori.findUnique({
        where: { guildId: '1' },
      });
      expect(_sh).toBeNull();

      await shiritoriProvider.setHandSize('1', size);
      const res = await prisma.shiritori.findUnique({
        where: { guildId: '1' },
        select: { handSize: true },
      });
      expect(res?.handSize).toBe(size);
    });
  });
});

describe('#getHandSize', () => {
  describe('found in redis', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce('1');
    });

    test('returns the value from redis as number', async () => {
      const res = await shiritoriProvider.getHandSize('1');
      expect(res).toBe(1);
    });

    test('extends ttl of key', async () => {
      await shiritoriProvider.getHandSize('1');
      expect(mockRedis.expire).toBeCalledWith(forShiritoriHand('1'), 60);
    });
  });

  describe('not in redis', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce(null);
    });

    describe('not in db either', () => {
      test('returns the default value', async () => {
        const _sh = await prisma.shiritori.findUnique({
          where: { guildId: '1' },
        });
        expect(_sh).toBeNull(); // check null

        const res = await shiritoriProvider.getHandSize('1');
        expect(res).toBe(DEFAULT_SHIRITORI_HAND);
      });

      test('caches the default value', async () => {
        await shiritoriProvider.getHandSize('1');
        expect(mockRedis.set).toBeCalledWith(
          forShiritoriHand('1'),
          DEFAULT_SHIRITORI_HAND,
          'ex',
          60,
        );
      });
    });

    describe('found in db', () => {
      beforeEach(async () => {
        await prisma.guild.create({
          data: { guildId: '1', shiritori: { create: { handSize: 2 } } },
        });
      });

      test('returns the value from the db', async () => {
        const res = await shiritoriProvider.getHandSize('1');
        expect(res).toBe(2);
      });

      test('caches the value', async () => {
        await shiritoriProvider.getHandSize('1');
        expect(mockRedis.set).toBeCalledWith(
          forShiritoriHand('1'),
          2,
          'ex',
          60,
        );
      });
    });
  });
});
