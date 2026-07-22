import {redisClient} from '../redis-connection.js';


export const revoketoken = ({userId}) => {
return `user:revoked:${userId}`;
}



export const revoketokenKey =  ({userId,jti}) => {
    return `user:revoked:${userId}:${jti}`;
}

export const setRevokedToken = async ({key,value,ttl=null}) => {
    try {
        if(ttl){
            return await redisClient.set(key,data,{expiration:{value:ttl,type:'EX'}});  

        }else{
            return await redisClient.set(key,data);
        }
    } catch (error) {
        console.error('Error setting revoked token in Redis:', error);
    }  
}

export const getRevokedToken = async ({key}) => {
        try {
            return await redisClient.get(key);
        } catch (error) {
            console.error('Error getting revoked token from Redis:', error);
        }

    }
    
export const updateRevokedToken = async ({key,ttl=null,value}) => {
    try {
        const isExists = await redisClient.exists(key);
        if(!isExists) return false;
        const data=typeof value != "string" ? JSON.stringify(value) : value;
        if(ttl){
            return await redisClient.set(key,data,{expiration:{value:ttl,type:'EX'}});
        }
        else{
            return await redisClient.set(key,data);
        }
    } catch (error) {
        console.error('Error updating revoked token in Redis:', error);
    }}

export const deleteRevokedToken = async ({key}) => {
    try {
        const isExists = await redisClient.exists(key);
        if(!isExists) return false;
        return await redisClient.del(key);
    } catch (error) {
        console.error('Error deleting revoked token from Redis:', error);
    }}


export const expireRevokedToken = async ({key,ttl}) => {
    try {
        const isExists = await redisClient.exists(key);
        if(!isExists) return false;
        return await redisClient.expire(key,ttl);
    } catch (error) {
        console.error('Error expiring revoked token in Redis:', error);
    }

}

export const TTL= async ({key}) => {
    try {
        const isExists = await redisClient.exists(key);
        if(!isExists) return false;
        return await redisClient.ttl(key);
    } catch (error) {
        console.error('Error getting TTL of revoked token in Redis:', error);
    }

}


export const keys= async ({pattern}) => {
    try {
        return await redisClient.keys(pattern);
    } catch (error) {
        console.error('Error getting keys from Redis:', error);


}
}
