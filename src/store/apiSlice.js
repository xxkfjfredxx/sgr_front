import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api/',
  prepareHeaders: headers => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Token ${token}`);
    }
    const empresaId = localStorage.getItem('empresaActivaId');
    if (empresaId) {
      headers.set('X-Active-Company', empresaId);
    }
    return headers;
  }
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('empresaActivaId');
    localStorage.removeItem('user');
    window.location.href = '/?expired=1';
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  endpoints: builder => ({
    getEmployees: builder.query({
      query: () => 'employees/',
      transformResponse: response => (Array.isArray(response) ? response : response.results || [])
    })
    // Add additional endpoints here
  })
});

export const { useGetEmployeesQuery } = apiSlice;
