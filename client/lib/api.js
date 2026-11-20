import { getToken } from '@/lib/auth';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
const API_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 20000);

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  const token = Object.prototype.hasOwnProperty.call(options, 'token')
    ? options.token
    : getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
      cache: 'no-store'
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 0, null);
    }
    throw new ApiError('__BACKEND_DOWN__', 0, null);
  } finally {
    clearTimeout(timeoutId);
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok){
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
    throw new ApiError(data?.message || 'Request failed', response.status, data);
  }

  return data;
}

// Domain endpoints
export const domainApi = {
  getDomains: async () => request('/domains', { method: 'GET' }),
  createDomain: async (subdomain) =>
    request('/domains', {
      method: 'POST',
      body: JSON.stringify({ subdomain })
    }),
  deleteDomain: async (domainId) => request(`/domains/${domainId}`, { method: 'DELETE' }),
  getDomainRecords: async (domainId) => request(`/domains/${domainId}/records`, { method: 'GET' }),
  createRecord: async (domainId, payload) =>
    request(`/domains/${domainId}/records`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateRecord: async (recordId, payload) =>
    request(`/records/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  deleteRecord: async (recordId) => request(`/records/${recordId}`, { method: 'DELETE' }),
  checkAvailability: async (domain) =>
    request('/domains/check', {
      method: 'POST',
      body: JSON.stringify({ domain })
    })
};

// Authentication: sign-in is a redirect through Central Auth, handled by the backend.
// Navigating here starts it; with a live Central Auth session it returns with no screen at all.
const SIGN_IN_URL = `${API_BASE_URL}/auth/oauth2/authorization/central-auth`;

export function startSignIn() {
  if (typeof window !== 'undefined') window.location.assign(SIGN_IN_URL);
}

export const authApi = {
  // Trades the one-time code from /auth/callback for this app's token.
  exchange: async (code) =>
    request('/auth/exchange', {
      method: 'POST',
      token: null,
      body: JSON.stringify({ code })
    })
};

// User endpoints
export const userApi = {
  getMe: async () => request('/user/me', { method: 'GET' }),
  getLimits: async () => request('/user/limits', { method: 'GET' }),
  updateProfile: async (payload) =>
    request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
};
