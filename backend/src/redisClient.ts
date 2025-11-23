import { createClient } from 'redis';

const redis = createClient({
    username: 'default',
    password: 'PcETeSmuhCf8siZe7zSK2iIh2y4zGcAR',
    socket: {
        host: 'redis-14542.crce182.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14542
    }
});

redis.on('error', err => {
    console.log('Redis Client Error', err)
});

(async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
})();

export default redis;

