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

    const validatorSpy2 = sinon.spy();
    schema[0].value = ['a'];
    validator.validate(schema)
      .then(validatorSpy2);

    process.nextTick(() => {
      validatorSpy.should.have.been.calledOnce;
      validatorSpy.should.have.been.calledWith({ validationErrors: { tipo: ['Field "tipo" is invalid'] } });
      validatorSpy2.should.have.been.calledOnce;
      validatorSpy2.should.have.been.calledWith({ validationErrors: {} });
      done();
    });
  });

  it('should validate string type', (done) => {
    const schema = [{
      key: 'name',
      type: 'string',
      value: '',
      required: true
    }];

    const validator = new Validator();

    const validatorSpy = sinon.spy();
    validator.validate(schema)
      .then(validatorSpy);

    const validatorSpy2 = sinon.spy();
    schema[0].value = 'João Neto';
    validator.validate(schema)
      .then(validatorSpy2);

    const validatorSpy3 = sinon.spy();
    schema[0].value = [''];
    validator.validate(schema)
      .then(validatorSpy3);

    process.nextTick(() => {
      validatorSpy.should.have.been.calledOnce;
      validatorSpy.should.have.been.calledWith({ validationErrors: { name: ['Field "name" is required', 'Field "name" is invalid'] } });
      validatorSpy2.should.have.been.calledOnce;
      validatorSpy2.should.have.been.calledWith({ validationErrors: {} });
      validatorSpy3.should.have.been.calledOnce;
      validatorSpy3.should.have.been.calledWith({ validationErrors: { name: ['Field "name" is invalid'] } });
      done();
    });
  });

});
