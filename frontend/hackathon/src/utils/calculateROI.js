/**
 * Calculates operational costs and Vehicle ROI using the formula:
 * Vehicle ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
 */
export const calculateROI = (revenue, operationalCost, acquisitionCost) => {
  if (!acquisitionCost || acquisitionCost === 0) return 0;
  const netProfit = Number(revenue) - Number(operationalCost);
  const roi = (netProfit / Number(acquisitionCost)) * 100;
  return roi.toFixed(2);
};
