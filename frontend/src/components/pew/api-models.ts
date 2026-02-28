export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface ValidationError {
  path: string;
  message: string;
  summary?: string;
  value?: any;
  schema?: any;
}

export interface APIResponse<T> {
  status: number;
  value?: T;
  error?: string;
  validationErrors?: ValidationError[];
}
