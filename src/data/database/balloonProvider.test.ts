import { mocked } from 'ts-jest/utils';
import {
  DEFAULT_MAX_BALLOON,
  DEFAULT_MIN_BALLOON,
} from '../../games/balloon/utils/defaults';
import { prisma } from '../prismaClient';
import { forBalloonMax, forBalloonMin, redis } from '../redisClient';
import { BalloonProvider } from './balloonProvider';
jest.mock('../redisClient');

const mockRedis = mocked(redis, true);

const balloonProvider = new BalloonProvider(prisma, mockRedis);

afterEach(async () => {
  await prisma.guild.deleteMany();
  mockRedis.set.mockReset();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('#setBalloonMin', () => {
  test('uses upsert', async () => {
    const upsert = jest.spyOn(prisma.guild, 'upsert');
    await balloonProvider.setBalloonMin(10, '1');
    expect(upsert).toBeCalledTimes(1);
    upsert.mockRestore();
  });

  test('caches minVol to redis with 60 seconds ttl', async () => {
    const upsert = jest.spyOn(prisma.guild, 'upsert');
    await balloonProvider.setBalloonMin(10, '1');
    expect(mockRedis.set).toBeCalledWith(forBalloonMin('1'), 10, 'ex', 60);
    upsert.mockRestore();
  });

  test('throws an error if negative volume provided', () => {
    return expect(balloonProvider.setBalloonMin(-1, '1')).rejects.toThrow();
  });

  describe('guild does not exist in db', () => {
    test('creates the guild with balloon settings applied', async () => {
      const _guild = await prisma.guild.findUnique({ where: { guildId: '1' } });
      expect(_guild).toBeNull(); // check null

      await balloonProvider.setBalloonMin(10, '1');
      const res = await prisma.balloon.findUnique({
        where: { guildId: '1' },
        select: { minVol: true },
      });
      expect(res?.minVol).toBe(10);
    });
  });

  describe('guild exists in db', () => {
    describe('without minVol', () => {
      beforeEach(async () => {
        await prisma.guild.create({ data: { guildId: '1' } });
      });
      test('creates a minVol for the guild', async () => {
        await balloonProvider.setBalloonMin(10, '1');
        const res = await prisma.balloon.findUnique({
          where: { guildId: '1' },
          select: { minVol: true },
        });
        expect(res?.minVol).toBe(10);
      });
    });

    describe('with minVol', () => {
      beforeEach(async () => {
        await prisma.guild.create({
          data: { guildId: '1', balloon: { create: { minVol: 10 } } },
        });
      });
      test('updates minVol', async () => {
        await balloonProvider.setBalloonMin(20, '1');
        const res = await prisma.balloon.findUnique({
          where: { guildId: '1' },
          select: { minVol: true },
        });
        expect(res?.minVol).toBe(20);
      });
    });
  });
});

describe('#getBalloonMin', () => {
  describe('finds in redis', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce('10');
    });

    test('should not hit db', async () => {
      const findUnique = jest.spyOn(prisma.balloon, 'findUnique');
      await balloonProvider.getBalloonMin('1');
      expect(findUnique).not.toBeCalled();
      findUnique.mockRestore();
    });

    test('return value from redis as int', async () => {
      const res = await balloonProvider.getBalloonMin('1');
      expect(res).toBe(10);
    });

    test('sets 60 seconds ttl', async () => {
      await balloonProvider.getBalloonMin('1');
      expect(mockRedis.expire).toBeCalledWith(forBalloonMin('1'), 60);
    });
  });

  describe('could not find in redis', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce(null);
    });

    describe('exists in db', () => {
      beforeEach(async () => {
        await prisma.guild.create({
          data: { guildId: '1', balloon: { create: { minVol: 1 } } },
        });
      });

      test('returns the value from db', async () => {
        const res = await balloonProvider.getBalloonMin('1');
        expect(res).toBe(1);
      });

      test('caches the value in redis', async () => {
        await balloonProvider.getBalloonMin('1');
        expect(mockRedis.set).toBeCalledWith(forBalloonMin('1'), 1, 'ex', 60);
      });
    });

    describe('does not exist in db', () => {
      test('returns the default', async () => {
        const res = await balloonProvider.getBalloonMin('1');
        expect(res).toBe(DEFAULT_MIN_BALLOON);
      });

      test('caches the value in redis', async () => {
        await balloonProvider.getBalloonMin('1');
        expect(mockRedis.set).toBeCalledWith(
          forBalloonMin('1'),
          DEFAULT_MIN_BALLOON,
          'ex',
          60,
        );
      });
    });
  });
});

describe('#setBalloonMax', () => {
  test('uses upsert', async () => {
    const upsert = jest.spyOn(prisma.guild, 'upsert');
    await balloonProvider.setBalloonMax(10, '1');
    expect(upsert).toBeCalledTimes(1);
    upsert.mockRestore();
  });

  test('caches maxVol to redis with 60 seconds ttl', async () => {
    const upsert = jest.spyOn(prisma.guild, 'upsert');
    await balloonProvider.setBalloonMax(10, '1');
    expect(mockRedis.set).toBeCalledWith(forBalloonMax('1'), 10, 'ex', 60);
    upsert.mockRestore();
  });

  test('throws an error if negative volume provided', () => {
    return expect(balloonProvider.setBalloonMax(-1, '1')).rejects.toThrow();
  });

  describe('guild does not exist in db', () => {
    test('creates the guild with balloon settings applied', async () => {
      const _guild = await prisma.guild.findUnique({ where: { guildId: '1' } });
      expect(_guild).toBeNull(); // check null

      await balloonProvider.setBalloonMax(10, '1');
      const res = await prisma.balloon.findUnique({
        where: { guildId: '1' },
        select: { maxVol: true },
      });
      expect(res?.maxVol).toBe(10);
    });
  });

  describe('guild exists in db', () => {
    describe('without maxVol', () => {
      beforeEach(async () => {
        await prisma.guild.create({ data: { guildId: '1' } });
      });
      test('creates a maxVol for the guild', async () => {
        await balloonProvider.setBalloonMax(10, '1');
        const res = await prisma.balloon.findUnique({
          where: { guildId: '1' },
          select: { maxVol: true },
        });
        expect(res?.maxVol).toBe(10);
      });
    });

    describe('with maxVol', () => {
      beforeEach(async () => {
        await prisma.guild.create({
          data: { guildId: '1', balloon: { create: { maxVol: 10 } } },
        });
      });
      test('updates maxVol', async () => {
        await balloonProvider.setBalloonMax(20, '1');
        const res = await prisma.balloon.findUnique({
          where: { guildId: '1' },
          select: { maxVol: true },
        });
        expect(res?.maxVol).toBe(20);
      });
    });
  });
});

describe('#getBalloonMax', () => {
  describe('finds in redis', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce('10');
    });

    test('should not hit db', async () => {
      const findUnique = jest.spyOn(prisma.balloon, 'findUnique');
      await balloonProvider.getBalloonMax('1');
      expect(findUnique).not.toBeCalled();
      findUnique.mockRestore();
    });

    test('return value from redis as int', async () => {
      const res = await balloonProvider.getBalloonMax('1');
      expect(res).toBe(10);
    });

    test('sets 60 seconds ttl', async () => {
      await balloonProvider.getBalloonMax('1');
      expect(mockRedis.expire).toBeCalledWith(forBalloonMax('1'), 60);
    });
  });

  describe('could not find in redis', () => {
    beforeEach(() => {
      mockRedis.get.mockResolvedValueOnce(null);
    });

    describe('exists in db', () => {
      beforeEach(async () => {
        await prisma.guild.create({
          data: { guildId: '1', balloon: { create: { maxVol: 1 } } },
        });
      });

      test('returns the value from db', async () => {
        const res = await balloonProvider.getBalloonMax('1');
        expect(res).toBe(1);
      });

      test('caches the value in redis', async () => {
        await balloonProvider.getBalloonMax('1');
        expect(mockRedis.set).toBeCalledWith(forBalloonMax('1'), 1, 'ex', 60);
      });
    });

    describe('does not exist in db', () => {
      test('returns the default', async () => {
        const res = await balloonProvider.getBalloonMax('1');
        expect(res).toBe(DEFAULT_MAX_BALLOON);
      });

      test('caches the value in redis', async () => {
        await balloonProvider.getBalloonMax('1');
        expect(mockRedis.set).toBeCalledWith(
          forBalloonMax('1'),
          DEFAULT_MAX_BALLOON,
          'ex',
          60,
        );
      });
    });
  });
});
