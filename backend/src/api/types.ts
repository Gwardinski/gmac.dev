import { ZodIssue } from 'zod';

// Services always return this object
// Controllers always check for `const [value, error] = serviceCall()`
export type ServiceResponse<T> = [T | undefined, ErrorCode | undefined];

// Guards always return this object
// Controllers always check for `const [pass, status, error] = guardCall()`
export type GuardResponse = [boolean, ErrorCode | undefined];

// All Endpoints should return an object with `status` and either `value` or `error`
// `status` is already part of request, but having it in the response object makes for happy DX

// Frontend will always check for:
// const {status, value, error } = response
// or
// const {status, value, error, validationErrors} = response
// if submitting a form

// Happy Path
export type APIResponse<T> = {
  status: number;
  value: T;
};

// Sad Path
export type APIError = {
  status: number;
  error: ErrorCode;
  validationErrors?: ZodIssue[];
};

export type ErrorCode =
  | 'UNKNOWN'
  | 'ORM_ERROR'
  // auth checks
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  // sign up
  | 'EMAIL_ALREADY_EXISTS'
  | 'NAME_ALREADY_EXISTS'
  // verification
  | 'INVALID_UID'
  | 'INVALID_CODE'
  | 'CODE_EXPIRED'
  | 'ALREADY_VERIFIED'
  // verification edge cases
  | 'NO_CODE'
  | 'VERIFICATION_CODE_FAIL'
  // sign in
  | 'INCORRECT_CREDENTIALS'
  | 'NOT_VERIFIED'
  // Generic Forms (inc Sign In / Sign Up)
  | 'BAD_REQUEST'
  | 'NOT_FOUND'; // 404

const errorCodeToStatus: Record<ErrorCode, number> = {
  UNKNOWN: 500,
  ORM_ERROR: 500,
  // auth checks
  UNAUTHENTICATED: 401,
  UNAUTHORIZED: 403,
  // sign up
  EMAIL_ALREADY_EXISTS: 400,
  NAME_ALREADY_EXISTS: 400,
  // verification
  INVALID_UID: 400,
  INVALID_CODE: 400,
  CODE_EXPIRED: 400,
  ALREADY_VERIFIED: 400,
  // verification edge cases
  NO_CODE: 400,
  VERIFICATION_CODE_FAIL: 500,
  // sign in
  INCORRECT_CREDENTIALS: 400,
  NOT_VERIFIED: 400,
  // Generic Forms (inc Sign In / Sign Up)
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

// Function to get HTTP status by error code
export function getStatusByErrorCode(errorCode: ErrorCode): number {
  return errorCodeToStatus[errorCode];
}
