import {
  getStatusByErrorCode,
  type APIError,
  type ErrorCode,
  type GuardResponse,
  type ServiceResponse,
} from "./types";

// Overloaded Service Responses
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

// GuardResponse Responses
export function returnGuardResponse(error?: ErrorCode): GuardResponse {
  if (error) {
    return [false, error];
  }
  return [true, undefined];
}

export function returnAPIError(
  error: ErrorCode = "UNKNOWN",
  statusCode?: number
): { body: APIError; status: number } {
  const status = statusCode || getStatusByErrorCode(error);
  const response: APIError = { status, error };
  return { body: response, status };
}
