import { redis } from '../data/redisClient';
import { Event } from '../types/event';

const ready: Event = {
  name: 'ready',
  once: true,
  async listener() {
    console.log('Chika bot has logged in.');
    redis.ping().catch((err) => {
      console.error(err);
      Promise.reject(err);
    });
  },
};

export default ready;
