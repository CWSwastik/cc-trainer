// Average time to solve function
export const calculateAverageTime = (problemRating: number): number => {
  return 0.035 * problemRating - 14;
};

// Probability of solving the problem
export const calculateProbability = (problemRating: number, userRating: number): number => {
  return 1 / (1 + Math.pow(10, (problemRating - userRating) / 400));
};

// Performance score based on time
export const calculatePerformanceScore = (
  timeSpent: number,
  avgTime: number,
  decayConstant: number
): number => {
  if (timeSpent <= avgTime) return 1;
  return Math.exp(-decayConstant * (timeSpent - avgTime));
};

// Calculate rating change
export const calculateRatingChange = (
  problemRating: number,
  userRating: number,
  timeSpent: number,
  kFactor: number,
  decayConstant: number
): number => {
  const avgTime = calculateAverageTime(problemRating);
  const probability = calculateProbability(problemRating, userRating);
  const performanceScore = calculatePerformanceScore(timeSpent, avgTime, decayConstant);
  
  return Math.round(kFactor * (performanceScore - probability));
};