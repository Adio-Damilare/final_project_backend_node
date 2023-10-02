import env from 'dotenv';
env.config();
export const database_config: any = {
    HOST: process.env.DATABASE_HOST || '',
    USER: process.env.DATABASE_USER || '',
    PASSWORD: process.env.DATABASE_PASSWORD || '',
    DATABASENAME: process.env.DATABASE_NAME || '',
    DIALECT: process.env.DATABASE_DIALECT || '',
};
