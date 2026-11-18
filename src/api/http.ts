import axios from 'axios';

export const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data || error.message;
  }
  return error instanceof Error ? error.message : 'Неизвестная ошибка запроса';
}
