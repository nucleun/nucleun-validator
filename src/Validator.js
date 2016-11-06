import { Module } from 'nucleun-module';
import { array, boolean, date, number, object, required, string } from './validation-types';

export default class Validator extends Module {
  constructor() {
    super();

    this.validationErrors = {};
    this.isValid = false;

    this.use('array', array);
    // this.use('boolean', boolean);
    // this.use('date', date);
    // this.use('number', number);
    // this.use('object', object);
    this.use('required', required);
    // this.use('string', string);
  }

  _validateFieldType(field, validationType) {
    const error = this[validationType || field.type](field);

    if (error.message) {
      this.validationErrors[field.key] = this.validationErrors[field.key] || [];
      this.validationErrors[field.key].push(error.message);
      this.isValid = false;
    }
  }

  _setDefaultFieldValue(field) {
    field.value = (!field.value && typeof field.default === 'function') ?
      field.default(field) :
      field.default || field.value;
  }

  validateField(field) {
    return new Promise((resolve, reject) => {
      this._setDefaultFieldValue(field);

      if (!this._validateFieldType(field, 'required')) {
        reject(this.validationErrors);
      }

      if (!this._validateFieldType(field)) {
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
      Promise.all(fields.map(this.validateField.bind(this))) :
      this.validateField(fields);

    // this._reset();

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
