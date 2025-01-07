import { DataSource } from 'typeorm';
import {User} from '../models/userModel.js'
import { Student } from '../models/studentModel.js';

const conectDB = new DataSource ({
    type: "postgres",
    host: process.env.HOST,
    port: process.env.PORT_DB,
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    entities: [User,Student],
    synchronize: true,  
    logging: false,
});

export { conectDB };