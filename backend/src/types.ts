// Elysia validation error format
export interface ValidationError {
  path: string;
  message: string;
  summary?: string;
  value?: any;
  schema?: any;
}

// Final data model for all endpoints. Returned from controllers / router.
export interface APIResponse<T> {
  status: number;
  value?: T;
  error?: ErrorCode;
  validationErrors?: ValidationError[];
}

// returned from services.
export type ServiceResponse<T> = [T, undefined] | [undefined, ErrorCode];

// Returned from validation / lookup functions.
export type GuardResponse = [true, undefined] | [false, ErrorCode];

export const ERROR_CODES = [
  // Pew-specific errors:
  "INVALID_ROOM_CODE",
  "ROOM_NOT_FOUND",
  "ROOM_FAILED_TO_FIND_OR_JOIN",
  "INVALID_PLAYER_ID",
  // Generic errors:
  "UNKNOWN",
  "BAD_REQUEST",
  "INVALID_CODE",
  "NOT_FOUND",
  "UNAUTHORIZED",
  "FORBIDDEN",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export const ERROR_CODES_SET = new Set(ERROR_CODES);

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
