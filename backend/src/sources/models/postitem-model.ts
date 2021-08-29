import { Document } from 'dynamoose/dist/Document';
import { v4 as uuid } from 'uuid';
import { IPostItem } from '../../entities/post-item';
import { DynamoDatabase } from '../../external/databases/dynamoose-database';

const tableName = process.env.POSTITEM_DB_TABLE || 'env POSTITEM_DB_TABLE not found';

export const PostItemModel = DynamoDatabase.model<IPostItem & Document>(tableName, new DynamoDatabase.Schema(
    {
        userId: {
            type: String,
            hashKey: true,
        },
        postId: {
            type: String,
            default: () => uuid(),
            rangeKey: true,
            index: {
                name: 'postIdIndex',
                global: true,
                project: true,
            },
        },

        createdAt: String,
        description: String,
        attachmentUrl: String
    }
));