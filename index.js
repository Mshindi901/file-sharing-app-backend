import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './src/database/connect.js';
import delete_expired_files from './src/jobs/deleteFiles.js';
import nodeCron from 'node-cron';
import UserRoutes from './src/modules/users/routes.js';
import FileRoutes from './src/modules/Files/routes.js';
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use('/api', UserRoutes);
app.use('/api', FileRoutes);

nodeCron.schedule('*/5 * * * *', async () => {
    try {
        await delete_expired_files();
    } catch (error) {
        console.error(`Error with cleaning expired files ${error}`);
    };
});

app.listen(port, () => {
    connectDB();
    console.log('Server is Running');
});