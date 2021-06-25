import { updateActivity } from '../lib/updateActivity';
import type { Event } from '../types/event';

const guildCreate: Event = {
  name: 'guildDelete',
  once: false,
  listener: updateActivity,
};

export default guildCreate;
