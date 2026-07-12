export const getStatusVariant = (status) => {
  switch (status) {
    // Success / Positive
    case 'Available':
    case 'Completed':
    case 'Active':
      return 'success';
    
    // Warning / In-Progress
    case 'On Trip':
    case 'Dispatched':
    case 'In Shop':
    case 'Draft':
      return 'warning';
    
    // Danger / Negative
    case 'Retired':
    case 'Suspended':
    case 'Off Duty':
    case 'Cancelled':
      return 'danger';
      
    default:
      return 'neutral';
  }
};
