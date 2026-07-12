export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const isValidEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

export const validateForm = (data, rules) => {
  const errors = {};
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = 'This field is required';
    } else if (fieldRules.isEmail && !isValidEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (fieldRules.isPositive && !isPositiveNumber(value)) {
      errors[field] = 'Must be a positive number';
    }
  });
  return Object.keys(errors).length > 0 ? errors : null;
};
