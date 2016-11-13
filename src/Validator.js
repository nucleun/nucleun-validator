import { Module } from 'nucleun-module';
import { array, boolean, date, number, object, required, string, type } from './validation-types';

export default class Validator extends Module {
  constructor() {
    super();

    this._reset();

    this.use('array', array);
    // this.use('boolean', boolean);
    // this.use('date', date);
    // this.use('number', number);
    this.use('object', object);
    this.use('required', required);
    this.use('type', type);
    this.use('string', string);
  }

  _validateFieldValue(field, validationFn) {
    const validationResult = typeof validationFn === 'function' ?
      validationFn.call(validationFn, field) :
      this[validationFn || field.validate](field);



    if (validationResult.message) {
      this.validationErrors[field.key] = this.validationErrors[field.key] || [];
      this.validationErrors[field.key].push(validationResult.message);
      this.isValid = false;
    }
  }

  _setDefaultFieldValue(field) {
    field.value = (!field.value && typeof field.default === 'function') ?
      field.default(field) :
      field.value || field.default;
  }

  validateField(field) {
    return new Promise((resolve, reject) => {
      this._setDefaultFieldValue(field);

      if (!this._validateFieldValue(field, 'type')) {
        reject(this.validationErrors);
      }

      if (!this._validateFieldValue(field, 'required')) {
        reject(this.validationErrors);
      }

      if (!this._validateFieldValue(field, field.validate)) {
        reject(this.validationErrors);
      }

      resolve(field);
    });
  }

  _reset() {
    this.validationErrors = {};
    this.isValid = false;
  }

  validate(fields) {
    const validationPromise = Array.isArray(fields) ?
      Promise.all(fields.map(field => this.validateField(field))) :
      this.validateField(fields);

    this._reset();

    return validationPromise
      .then((fields) => {
        this.isValid = true;
        return fields;
      })
      .catch((validationErrors) => {
        return { validationErrors };
      });
  }

}
