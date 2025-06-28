// @types/express/index.d.ts
import { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms"

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}