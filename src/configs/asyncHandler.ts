import { Request, Response, NextFunction } from "express";

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// try {} catch {}