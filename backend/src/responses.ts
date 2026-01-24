import {
  getStatusByErrorCode,
  type APIResponse,
  type ErrorCode,
  type GuardResponse,
  type ServiceResponse,
} from "./types";

// Validation / Lookup Responses
export function returnGuardResponse(error?: ErrorCode): GuardResponse {
  if (error) {
    return [false, error];
  }
  return [true, undefined];
}

// Service Responses (Overloaded)
export function returnServiceResponse<T>(value: T): ServiceResponse<T>;
export function returnServiceResponse<T>(error: ErrorCode): ServiceResponse<T>;
export function returnServiceResponse<T>(
  value?: T,
  error?: ErrorCode
): ServiceResponse<T> {
  if (error) {
    return [undefined, error];
  }
  return [value as T, undefined];
}

// Controller Responses
export function returnAPIResponse<T>(
  value: T,
  status: number = 200
): APIResponse<T> {
  const response: APIResponse<T> = { status, value };
  return response;
}

export function returnAPIError<T>(
  error: ErrorCode = "UNKNOWN",
  statusCode?: number,
  validationErrors?: any[]
): APIResponse<T> {
  const status = statusCode || getStatusByErrorCode(error);
  const response: APIResponse<T> = {
    status,
    error,
    value: undefined,
    validationErrors,
  };
  return response;
}
