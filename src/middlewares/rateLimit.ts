import rateLimit from 'express-rate-limit';
import { TooManyRequests } from 'http-errors';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Rate limiting configuration for authentication endpoints
export const authRateLimiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message:
    'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    throw new TooManyRequests(options.message);
  },
});

// Rate limiting for public API endpoints
export const apiRateLimiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    throw new TooManyRequests(options.message);
  },
});
