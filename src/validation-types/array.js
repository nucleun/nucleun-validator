export default (field, message) => {
  if (Array.isArray(field.value)) {
    return true;
  }

  return new Error(message || `Field "${field.key}" is invalid`);
};
