import { useAuth } from '@clerk/expo';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { config } from './config';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Returns a fetcher that attaches the current Clerk session token. */
export function useApi() {
  const { getToken } = useAuth();
  return useCallback(
    async <T>(path: string, init?: RequestInit): Promise<T> => {
      const token = await getToken();
      const response = await fetch(`${config.apiUrl}${path}`, {
        ...init,
        headers: {
          Accept: 'application/json',
          ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...init?.headers,
        },
      });
      if (!response.ok) {
        throw new ApiError(response.status, `${init?.method ?? 'GET'} ${path} failed`);
      }
      return (await response.json()) as T;
    },
    [getToken],
  );
}

export type Me = { id: string; clerk_user_id: string; timezone: string };

export function useMe() {
  const api = useApi();
  return useQuery({ queryKey: ['me'], queryFn: () => api<Me>('/v1/me') });
}
