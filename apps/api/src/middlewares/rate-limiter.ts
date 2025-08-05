import rateLimit from 'express-rate-limit';

// Constants for calculation
const MILLISECONDS_IN_A_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const MINUTES_IN_WINDOW = 15;
const MAX_REQUESTS = 100;

// Calculated value
const WINDOW_MS =
  MINUTES_IN_WINDOW * SECONDS_IN_A_MINUTE * MILLISECONDS_IN_A_SECOND;

/**
 * Middleware to rate-limit requests.
 */
export const rateLimiter = () => {
  return rateLimit({
    windowMs: WINDOW_MS,
    max: MAX_REQUESTS,
  });
};
