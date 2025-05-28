/**
 * Strapi API client utility
 * Provides standardized methods for interacting with Strapi API
 */

import qs from 'qs';

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  start?: number;
  limit?: number;
}

/**
 * Interface for sort parameters
 */
export interface SortParams {
  sort?: string | string[];
}

/**
 * Interface for filter parameters
 */
export interface FilterParams {
  filters?: Record<string, any>;
}

/**
 * Interface for population parameters
 */
export interface PopulateParams {
  populate?: string | string[] | Record<string, any>;
}

/**
 * Combined query parameters interface
 */
export type QueryParams = PaginationParams & 
  SortParams & 
  FilterParams & 
  PopulateParams & 
  Record<string, any>;

/**
 * Base fetcher function for Strapi API
 */
export const fetcher = async (path: string, options: RequestInit = {}) => {
  try {
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    const token = localStorage.getItem('strapi_jwt');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const mergedOptions: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(path, mergedOptions);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(
          data.error?.message || 
          data.message || 
          `API error: ${response.status} ${response.statusText}`
        );
      }
      
      return data;
    }
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Get the full URL for a Strapi API endpoint
 * Handles both relative and absolute paths
 */
export const getStrapiURL = (path: string = '') => {
  // Remove leading slash if present
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  return normalizedPath;
};

/**
 * Format query parameters for Strapi API
 */
export const formatStrapiQuery = (params: QueryParams = {}) => {
  return qs.stringify(params, { 
    encodeValuesOnly: true,
    arrayFormat: 'brackets'
  });
};

/**
 * Get a collection from Strapi API
 */
export const getCollection = async <T>(
  path: string, 
  params: QueryParams = {}
): Promise<{ data: T[], meta: any }> => {
  const query = formatStrapiQuery(params);
  const url = `/api/${path}?${query}`;
  return fetcher(url);
};

/**
 * Get a single entry from Strapi API
 */
export const getSingleEntry = async <T>(
  path: string, 
  id: string | number,
  params: QueryParams = {}
): Promise<{ data: T, meta: any }> => {
  const query = formatStrapiQuery(params);
  const url = `/api/${path}/${id}?${query}`;
  return fetcher(url);
};

/**
 * Create an entry in Strapi API
 */
export const createEntry = async <T>(
  path: string, 
  data: Record<string, any>
): Promise<{ data: T }> => {
  const url = `/api/${path}`;
  return fetcher(url, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
};

/**
 * Update an entry in Strapi API
 */
export const updateEntry = async <T>(
  path: string,
  id: string | number,
  data: Record<string, any>
): Promise<{ data: T }> => {
  const url = `/api/${path}/${id}`;
  return fetcher(url, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
};

/**
 * Delete an entry from Strapi API
 */
export const deleteEntry = async <T>(
  path: string,
  id: string | number
): Promise<{ data: T }> => {
  const url = `/api/${path}/${id}`;
  return fetcher(url, {
    method: 'DELETE',
  });
};

/**
 * Handle authentication with Strapi
 */
export const strapiAuth = {
  /**
   * Login with email and password
   */
  login: async (identifier: string, password: string) => {
    const url = '/api/auth/local';
    const response = await fetcher(url, {
      method: 'POST',
      body: JSON.stringify({
        identifier,
        password,
      }),
    });
    
    if (response.jwt) {
      localStorage.setItem('strapi_jwt', response.jwt);
      localStorage.setItem('strapi_user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  /**
   * Register a new user
   */
  register: async (username: string, email: string, password: string) => {
    const url = '/api/auth/local/register';
    const response = await fetcher(url, {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    
    if (response.jwt) {
      localStorage.setItem('strapi_jwt', response.jwt);
      localStorage.setItem('strapi_user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('strapi_jwt');
    localStorage.removeItem('strapi_user');
  },
  
  /**
   * Get the current user from local storage
   */
  getUser: () => {
    const user = localStorage.getItem('strapi_user');
    return user ? JSON.parse(user) : null;
  },
  
  /**
   * Check if a user is logged in
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('strapi_jwt');
  },
};
