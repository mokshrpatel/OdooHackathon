export const calculateTotalOperationalCost = (fuelCost, maintenanceCost, generalExpense = 0) => {
  return (Number(fuelCost) || 0) + (Number(maintenanceCost) || 0) + (Number(generalExpense) || 0);
};
