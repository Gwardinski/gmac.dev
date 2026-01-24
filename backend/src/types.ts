// Final data model for all endpoints. Returned from controllers / router.
export interface APIResponse<T> {
  status: number;
  value?: T;
  error?: ErrorCode;
  validationErrors?: any[]; // todo: replace with zod4 validation error model
}

// returned from services.
export type ServiceResponse<T> = [T, undefined] | [undefined, ErrorCode];

// Returned from validation / lookup functions.
export type GuardResponse = [true, undefined] | [false, ErrorCode];

export type ErrorCode =
  // Pew-specific errors:
  | "INVALID_ROOM_CODE"
  // Generic errors:
  | "UNKNOWN"
  | "BAD_REQUEST"
  | "INVALID_CODE"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN";

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
    case "ROOM_NAME_ALREADY_EXISTS":
      return 400;
    case "UNKNOWN":
    default:
      return 500;
  }
}
