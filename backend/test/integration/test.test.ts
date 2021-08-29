import chai from 'chai';
import { Lambda } from 'aws-sdk';

const lambda = new Lambda({
    region: 'us-east-1',
    apiVersion: '2015-03-31',
    endpoint: 'http://localhost:3002'
})

describe('Test integration base', () => {

    it('Should... integration', async () => {
        //
    })

})
