import { expect } from 'chai';

const testA = {
    aString: 'aString',
    aBoolean: true,
    neested: {
        aNull: null,
        aNumber: 10
    }
}

const testB = {
    aString: 'aString',
    aBoolean: true,
    neested: {
        aNull: null,
        aNumber: 10
    }
}

describe('Test unit base', () => {

    it('Should... expect()', async () => {

        expect(testA).to.not.equal(testB);
        expect(testA).to.deep.equal(testB);

        return;

    })

})
