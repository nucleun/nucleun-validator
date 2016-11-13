import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import Validator from '../src/Validator';
import { array } from '../src/validation-types';

describe('# Validator', () => {
  it('should validate with success', (done) => {
    const schema = [
      {
        key: 'tipo',
        type: Array,
        validate: () => new Error('MY ERROR'),
        default: () => 'a',
        label: 'Tipo',
        required: true
      },
      {
        key: 'uf',
        type: Array,
        validate: array,
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
      validatorSpy.should.have.been.calledWith({ validationErrors: { tipo: ['Type of "tipo" is invalid', 'MY ERROR'] } });
      validatorSpy2.should.have.been.calledOnce;
      validatorSpy2.should.have.been.calledWith({ validationErrors: { tipo: ['MY ERROR'] } });
      done();
    });
  });

  it('should validate type String', (done) => {
    const schema = [{
      key: 'name',
      type: String,
      value: undefined,
      validate: 'string',
      default: 'nome',
      required: true
    }];

    const validator = new Validator();

    const validatorSpy = sinon.spy();
    validator.validate(schema)
      .then(validatorSpy);

    process.nextTick(() => {
      validatorSpy.should.have.been.calledOnce;
      validatorSpy.should.have.been.calledWith({ validationErrors: {} });
      done();
    });
  });

  it('should validate type Object', (done) => {
    const schema = [{
      key: 'name',
      type: Object,
      value: {},
      validate: 'object',
      default: [],
      required: true
    }];

    const validator = new Validator();

    const validatorSpy = sinon.spy();
    validator.validate(schema)
      .then(validatorSpy);

    process.nextTick(() => {
      validatorSpy.should.have.been.calledOnce;
      validatorSpy.should.have.been.calledWith({ validationErrors: {} });
      done();
    });
  });

});
