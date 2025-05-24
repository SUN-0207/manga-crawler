import { MongooseModuleOptions } from '@nestjs/mongoose';

console.log(process.env.MONGO_URI);

export const databaseConfig: MongooseModuleOptions = {
  uri: process.env.MONGO_URI,
};
