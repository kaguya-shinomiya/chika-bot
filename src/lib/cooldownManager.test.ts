import { setCooldown, getCooldown } from './cooldownManager';
import { forCooldown, redis } from '../data/redisClient';

afterAll(() => {
  return redis.quit();
});

describe('cooldownManager', () => {
  const setSpy = jest.spyOn(redis, 'set');
  const pttlSpy = jest.spyOn(redis, 'pttl');

  beforeEach(() => {
    setSpy.mockReset();
    pttlSpy.mockReset();
  });

  describe('#setCooldown', () => {
    it('calls set once', () => {
      setCooldown('id', 'command', 10);
      expect(setSpy).toBeCalledTimes(1);
    });
    it('calls set with correct params', () => {
      setCooldown('id', 'command', 10);
      expect(setSpy).toBeCalledWith(
        forCooldown('id:command'),
        'command',
        'px',
        10,
      );
    });
  });

  describe('#getCooldown', () => {
    it('calls get once', () => {
      getCooldown('id', 'command');
      expect(pttlSpy).toBeCalledTimes(1);
    });
    it('calls set with correct params', () => {
      getCooldown('id', 'command');
      expect(pttlSpy).toBeCalledWith(forCooldown('id:command'));
    });
    it('returns 0 if key already expired or has no ttl set (-1 or -2)', () => {
      pttlSpy.mockResolvedValueOnce(-1);
      return getCooldown('id', 'command').then((res) => {
        expect(res).toBe(0);
      });
    });
    it('returns ttl if ttl is found', () => {
      pttlSpy.mockResolvedValueOnce(1000);
      return getCooldown('id', 'command').then((res) => {
        expect(res).toBe(1000);
      });
    });
  });
});
