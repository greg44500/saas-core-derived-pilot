import mongoose from 'mongoose';

import '../config/applicationRolePermission.registry.js';
import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import {
    backfillRegisteredSystemRolePermissions,
} from './backfillRegisteredSystemRolePermissions.migration.js';


const run = async () => {
    try {
        await connectDB(env.MONGODB_URI);

        const result =
            await backfillRegisteredSystemRolePermissions();

        console.log(
            'Migration catalog system role permissions terminée :',
            result,
        );
    } catch (error) {
        console.error(
            'Échec de la migration catalog system role permissions :',
            { message: error.message },
        );
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

run();
