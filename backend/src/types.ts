import type { ZodIssue } from "zod";

export type ErrorCode =
  | "UNKNOWN"
  | "BAD_REQUEST"
  | "INVALID_CODE"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN";

export interface APIResponse<T> {
  status: number;
  value: T;
}

export interface APIError {
  status: number;
  error: ErrorCode;
  validationErrors?: ZodIssue[];
}

export type ServiceResponse<T> = [T, undefined] | [undefined, ErrorCode];
export type GuardResponse = [true, undefined] | [false, ErrorCode];

export function getStatusByErrorCode(error: ErrorCode): number {
  switch (error) {
    case "BAD_REQUEST":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "INVALID_CODE":
      return 400;
    case "UNKNOWN":
    default:
      return 500;
  }
}
