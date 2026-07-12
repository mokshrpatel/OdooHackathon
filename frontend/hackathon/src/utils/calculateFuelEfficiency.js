export const calculateFuelEfficiency = (distance, fuelLiters) => {
  if (!fuelLiters || fuelLiters === 0) return 0;
  return (Number(distance) / Number(fuelLiters)).toFixed(2);
};
