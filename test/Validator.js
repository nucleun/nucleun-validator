import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import Validator from '../src/Validator';

describe('# Validator', () => {
  it('should validate with success', (done) => {
    const schema = [
      {
        key: 'tipo',
        type: 'array',
        default: () => 'a',
        label: 'Tipo',
        required: true
      },
      {
        key: 'uf',
        type: 'array',
        value: ['a', 'b', 'c'],
        label: 'UF',
        required: true
      }
    ];

    const validator = new Validator();
    const validatorSpy = sinon.spy();

    validator.validate(schema)
      .then(validatorSpy);

    process.nextTick(() => {
      validatorSpy.should.have.been.calledOnce;
      validatorSpy.should.have.been.calledWith({ validationErrors: { tipo: ['Field "tipo" is invalid'] } });
      done();
    });
  });

});
