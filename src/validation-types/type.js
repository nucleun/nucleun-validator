export default (field, message) => {
  const valueType = {}.toString.call(field.value).replace(/\[object\s(.+).*\]/, '$1');
  const fieldType = field.type.toString().replace(/function\s(.+)\(\).*/, '$1');


  if (fieldType === valueType) {
    return true;
  }

  return new Error(message || `Type of "${field.key}" is invalid`);
};
