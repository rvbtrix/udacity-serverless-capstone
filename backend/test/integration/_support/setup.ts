import serverlessRunner from './serverless-runner';
import supertest from 'supertest';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiAsPromised from 'chai-as-promised';

export let server = supertest('');

chai.use(chaiSubset);
chai.use(chaiAsPromised);

// chai.config.includeStack = true;

before('Start Serverless Offline', async () => {

    const serverUrl = await serverlessRunner.start('local');


    server = supertest(serverUrl);
});

after('Stop Serverless Offline', async () => {

    return await serverlessRunner.stop();

});