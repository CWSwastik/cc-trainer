// Average time to solve function
export const calculateAverageTime = (
  problemRating: number,
  userRating: number
): number => {
  return (
    10 + (50 / 3000) * problemRating ** 1.1 - (20 / 3000) * userRating ** 1.125
  );
};

// Probability of solving the problem
export const calculateProbability = (
  problemRating: number,
  userRating: number
): number => {
  return 1 / (1 + Math.pow(10, (problemRating - userRating) / 400));
};

// Performance score based on time
export const calculatePerformanceScore = (
  timeSpent: number,
  avgTime: number,
  decayConstant: number
): number => {
  if (timeSpent <= avgTime) return 1 + (avgTime - timeSpent) / avgTime;
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
  const avgTime = calculateAverageTime(problemRating, userRating);
  const probability = calculateProbability(problemRating, userRating);
  const performanceScore = calculatePerformanceScore(
    timeSpent,
    avgTime,
    decayConstant
  );

  return Math.round(kFactor * (performanceScore - probability));
};
