import { redis } from '../data/redisClient';
import { Event } from '../types/event';

const ready: Event = {
  name: 'ready',
  once: true,
  listener() {
    redis.ping().catch((err) => {
      console.error(err);
      Promise.reject(err);
    });
  },
};

export default ready;
