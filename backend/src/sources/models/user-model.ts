import { Document } from 'dynamoose/dist/Document';
import { v4 as uuid } from 'uuid';
import { IUser } from '../../entities/user';
import { DynamoDatabase } from '../../external/databases/dynamoose-database';

const tableName = process.env.USER_DB_TABLE || 'env USER_DB_TABLE not found';

export const UserModel = DynamoDatabase.model<IUser & Document>(tableName, new DynamoDatabase.Schema(
    {
        userId: {
            hashKey: true,
            type: String
        },

        email: String,
        createdAt: String,
        name: String,
        lastName: String,
    }
));