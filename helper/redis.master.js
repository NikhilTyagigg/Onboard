/*
Name: Redis Master
Description: This file consists of the functions that set/get redis cache
Authors: Nitesh Kumar
Created: July 09, 2021
Last Updated: 07/09/2021
*/

const { redisClient, redisGetAsync, redisSetAsync, redisDelAsync } = require('./redis')
const { REDIS_MASTER } = require('./constant')
const { Sequelize } = require('../models')
const logger = require('../helper/logger')

var models = require('../models');
let Users = models.User

const Op = Sequelize.Op;

const config = require('config');
const redisConfig = config.get('redis');

var main = {}

main.getUserFromRedis = async () => {
    try {
        logger.info(`Fetching user from redis cache`);
        let users = await redisGetAsync(REDIS_MASTER.USERS)
        if (users) {
            users = JSON.parse(users)
            logger.info(`Fetched ${users.length} users from redis cache`);
        } else {
            logger.info(`Fetching users from DB`);

            users = await Users.findAll({});

            logger.info(`Fetched ${users.length} stores from Integration DB`);

            if (users && users.length > 0) {

                await redisSetAsync(REDIS_MASTER.USERS, JSON.stringify(users), 'EX', redisConfig.expiry.user);
                logger.info(`Added users to redis cache`);
            }
        }

        return users;

    } catch(err) {
        logger.error(`${err}`)
        if (err.code === 'ECONNREFUSED') {
            logger.error('Server not working properly.');
            process.exit(1)
        }
        throw new Error({message: err.message});
    }
}


main.refreshRedisCache = async () => {
    try {
        logger.info('Deleting redis cache!')
        await redisDelAsync(REDIS_MASTER.USERS)
        
        logger.info('Redis cache deleted!')
        logger.info('Setting redis cache!')


        logger.info('Redis cache updated!')
    }
    catch(err) {
        logger.error(`${err}`)
    }
}


module.exports = main