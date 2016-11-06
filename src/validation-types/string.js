export default (field, message) => {
  if (typeof field.value === 'string') {
    return true;
  }

  return new Error(message || `Field "${field.key}" is invalid`);
};
