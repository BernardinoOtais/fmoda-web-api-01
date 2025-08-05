import helmet from 'helmet';
import xss from 'x-xss-protection';

/**
 * Middleware for security headers.
 */
export const securityMiddleware = () => {
  return [helmet(), xss()];
};
