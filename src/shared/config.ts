import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || '3000';

export const config = {
    envName: process.env.NODE_ENV,
    port,
    mongodb: {
        name: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        expiresInAccess: process.env.JWT_EXPIRES_IN_ACCESS,
        expiresInRefresh: process.env.JWT_EXPIRES_IN_REFRESH
    }
};