import express from 'express';
import { ZodIssue } from 'zod';
import {
  APIError,
  APIResponse,
  ErrorCode,
  getStatusByErrorCode,
  GuardResponse,
  ServiceResponse,
} from './types.js';

// Overloaded Service Responses
export function returnServiceResponse<T>(value: T): ServiceResponse<T>;
export function returnServiceResponse<T>(error: ErrorCode): ServiceResponse<T>;
export function returnServiceResponse<T>(
  value?: T,
  error?: ErrorCode,
): ServiceResponse<T> {
  if (error) {
    return [undefined, error];
  }
  return [value, undefined];
}

// GuardResponse Responses
export function returnGuardResponse(error?: ErrorCode): GuardResponse {
  if (error) {
    return [false, error];
  }
  return [true, undefined];
}

// API Responses

export async function returnAPIResponse<T>(
  res: express.Response,
  value: T,
  status: number = 200,
) {
  const response: APIResponse<T> = { status, value };
  return res.status(status).send(response).end();
}

export async function returnAPIError(
  res: express.Response,
  error: ErrorCode = 'UNKNOWN',
  statusCode?: number,
) {
  const status = statusCode || getStatusByErrorCode(error);
  const response: APIError = { status, error };
  return res.status(status).send(response).end();
}

export async function returnAPIValidationError(
  res: express.Response,
  validationErrors: ZodIssue[],
  status: number = 400,
): Promise<express.Response<unknown, Record<string, unknown>>> {
  const response: APIError = {
    status: status,
    error: 'BAD_REQUEST',
    validationErrors,
  };
  return res.status(status).send(response).end();
}
