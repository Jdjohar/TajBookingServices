import dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'jwtsecret',
    lifetime: process.env.JWT_LIFETIME || '30d'
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/airporttransfers'
  }
};