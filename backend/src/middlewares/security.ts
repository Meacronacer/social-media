import helmet from "helmet";
import { RequestHandler } from "express";

export const securityMiddleware = (): RequestHandler[] => {
  return [
    helmet(),
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    }),
  ];
};
