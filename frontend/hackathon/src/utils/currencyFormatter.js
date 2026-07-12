export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(0);
  }
  
  // Use en-IN locale for INR for proper comma formatting
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
