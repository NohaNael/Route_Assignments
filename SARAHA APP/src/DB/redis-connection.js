import {createClient} from 'redis';
import {REDIS_URL} from '../../config/config.service.js';

export const redisClient = createClient({
  url: process.env.REDIS_URL ,
  RESP:2
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();    
    console.log('Redis connected successfully');
  }
    catch (error) { 
        console.error('Redis connection error:', error);
    }   
}