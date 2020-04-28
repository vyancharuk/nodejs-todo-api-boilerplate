export default function useRateLimiter(id, params) {
  return (target) => {
    if (!target.rateLimiters) {
      target.rateLimiters = [];
    }
    target.rateLimiters.push({
      keyPrefix: id,
      ...params,
    });
  };
}
