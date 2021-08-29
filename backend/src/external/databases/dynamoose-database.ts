import dynamoose from 'dynamoose';
import * as https from 'https';

let httpAgent = new https.Agent({
    rejectUnauthorized: true,
    keepAlive: true,
});

if (process.env.IS_OFFLINE) httpAgent = undefined;

dynamoose.aws.sdk.config.update({
    region: process.env.REGION || 'us-east-1',
    httpOptions: {
        agent: httpAgent,
    },
});

dynamoose.model.defaults.set({
    create: false,
    update: false,
    waitForActive: false,
});

if (process.env.IS_OFFLINE) dynamoose.aws.ddb.local();

export const DynamoDatabase = dynamoose;
