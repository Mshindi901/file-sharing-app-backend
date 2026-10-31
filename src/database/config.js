import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize('share', 'postgres', 'yugah2005@', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

