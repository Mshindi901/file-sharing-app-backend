import { sequelize } from "./config.js";

export const connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Database Connected Successfully');
        await sequelize.sync({alter: true});
        console.log('Models Synchronized');
    } catch (error) {
        console.error(`Error with connecting to the database ${error}`);
        return null;
    }
};