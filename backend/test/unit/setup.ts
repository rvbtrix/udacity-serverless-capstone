import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import chaiAsPromised from 'chai-as-promised';

chai.use(sinonChai);
chai.use(chaiSubset);
chai.use(chaiAsPromised);

// ENV

if (process.argv.includes('--watch')) {

    before(() => {
        process.stdout.write('\u001B[0;0f');
        console.clear();
    });

}