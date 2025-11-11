// @ts-nocheck
import { useQuery, useMutation, QueryKey, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from './api';

export type ApiError = {
  message: string;
  statusCode: number;
};

// Generic GET hook
export function useApiQuery<T>(
  key: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<T, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, AxiosError<ApiError>>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(endpoint);
      return data;
    },
    ...options,
  });
}

// Generic POST hook
export function useApiMutation<TData, TVariables>(
  endpoint: string,
  options?: Omit<
    UseMutationOptions<TData, AxiosError<ApiError>, TVariables>,
    'mutationFn'
  >
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await api.post<TData>(endpoint, variables);
      return data;
    },
    ...options,
  });
}

// Generic PUT hook
export function useApiPut<TData, TVariables>(
  endpoint: string,
  options?: Omit<
    UseMutationOptions<TData, AxiosError<ApiError>, TVariables>,
    'mutationFn'
  >
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await api.put<TData>(endpoint, variables);
      return data;
    },
    ...options,
  });
}

// Generic DELETE hook
export function useApiDelete<TData>(
  endpoint: string,
  options?: Omit<
    UseMutationOptions<TData, AxiosError<ApiError>, void>,
    'mutationFn'
  >
) {
  return useMutation<TData, AxiosError<ApiError>, void>({
    mutationFn: async () => {
      const { data } = await api.delete<TData>(endpoint);
      return data;
    },
    ...options,
  });
}