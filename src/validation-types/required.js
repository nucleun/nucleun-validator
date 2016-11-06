export default (field, message) => {
  if (field.value) {
    return true;
  }

  return new Error(message || `Field "${field.key}" is required`);
};
