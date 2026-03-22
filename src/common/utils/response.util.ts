import { ApiResponse } from '../interfaces/api-response.interface';

export const buildResponse = <T>(
  message: string,
  data: T,
  meta?: ApiResponse<T>['meta'],
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
};