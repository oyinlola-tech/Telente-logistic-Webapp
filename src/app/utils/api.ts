const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_TOKEN_KEY = 'telente_admin_token';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: { message?: string; code?: string };
};

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token: string | null) {
  if (!token) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function normalizePackage(input: any): Package {
  return {
    id: input.id,
    trackingNumber: input.trackingNumber ?? input.tracking_number,
    senderName: input.senderName ?? input.sender_name,
    senderEmail: input.senderEmail ?? input.sender_email ?? '',
    senderPhone: input.senderPhone ?? input.sender_phone,
    senderAddress: input.senderAddress ?? input.sender_address,
    recipientName: input.recipientName ?? input.recipient_name,
    recipientEmail: input.recipientEmail ?? input.recipient_email ?? '',
    recipientPhone: input.recipientPhone ?? input.recipient_phone,
    recipientAddress: input.recipientAddress ?? input.recipient_address,
    weight: Number(input.weight),
    dimensions: input.dimensions,
    service: input.service,
    status: input.status,
    currentLocation: input.currentLocation ?? input.current_location ?? '',
    estimatedDelivery: input.estimatedDelivery ?? input.estimated_delivery,
    createdAt: input.createdAt ?? input.created_at,
    updatedAt: input.updatedAt ?? input.updated_at,
    trackingHistory: (input.trackingHistory || []).map((event: any) => ({
      id: event.id,
      timestamp: event.timestamp,
      location: event.location,
      status: event.status,
      description: event.description || '',
    })),
  };
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const rawText = await response.text();
  let parsed: any = null;
  if (rawText) {
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = rawText;
    }
  }

  if (!response.ok) {
    const message =
      parsed?.error?.message || parsed?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (parsed && typeof parsed === 'object' && 'success' in parsed && 'data' in parsed) {
    return (parsed as ApiEnvelope<T>).data;
  }

  return parsed as T;
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface Package {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderEmail?: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone: string;
  recipientAddress: string;
  weight: number;
  dimensions: string;
  service: string;
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delayed' | 'delivered' | 'cancelled';
  currentLocation?: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  trackingHistory: TrackingEvent[];
}

export interface CreatePackageData {
  senderName: string;
  senderEmail?: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone: string;
  recipientAddress: string;
  weight: number;
  dimensions: string;
  service: string;
  estimatedDelivery: string;
  status?: Package['status'];
}

export interface UpdatePackageData {
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress?: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  weight?: number;
  dimensions?: string;
  service?: string;
  status?: Package['status'];
  statusDescription?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  service: string;
  message?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  author: string;
}

export interface NewsUpsertData {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  postedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  longDescription?: string;
  benefits?: string[];
}

export interface JobApplicationData {
  name: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeFileName?: string;
}

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeFileName: string;
  status: ApplicationStatus;
  statusUpdatedAt?: string;
  submittedAt: string;
}

export type ApplicationStatus = 'new' | 'reviewed' | 'shortlisted' | 'rejected';

export interface JobUpsertData {
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
}

export interface AdminAuth {
  id: number;
  username: string;
  token: string;
}

export interface AdminLoginChallenge {
  otpRequired: true;
  challengeToken: string;
  expiresAt: string;
  devOtp?: string;
}

export const authApi = {
  login: (data: { username: string; password: string }) =>
    apiRequest<AdminLoginChallenge>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyOtp: async (data: { challengeToken: string; otp: string }) => {
    const result = await apiRequest<AdminAuth>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(result.token);
    return result;
  },
  resendOtp: (data: { challengeToken: string }) =>
    apiRequest<{ expiresAt: string; devOtp?: string }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  forgotPassword: (data: { identifier: string }) =>
    apiRequest<{ message: string; devResetToken?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resetPassword: (data: { token: string; newPassword: string }) =>
    apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: () => apiRequest<{ id: number; username: string }>('/auth/me'),
  logout: () => setAuthToken(null),
  getToken: () => getAuthToken(),
};

export const packageApi = {
  getByTrackingNumber: async (trackingNumber: string) =>
    normalizePackage(await apiRequest<any>(`/packages/track/${trackingNumber}`)),

  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const data = await apiRequest<{ packages: any[]; total: number; page: number; totalPages: number }>(
      `/packages${queryParams ? `?${queryParams}` : ''}`
    );

    return {
      ...data,
      packages: data.packages.map(normalizePackage),
    };
  },

  getById: async (id: string) => normalizePackage(await apiRequest<any>(`/packages/${id}`)),

  create: async (data: CreatePackageData) =>
    normalizePackage(
      await apiRequest<any>('/packages', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    ),

  update: async (id: string, data: UpdatePackageData) =>
    normalizePackage(
      await apiRequest<any>(`/packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    ),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/packages/${id}`, {
      method: 'DELETE',
    }),

  addTrackingEvent: async (
    id: string,
    event: { location: string; status: string; description: string }
  ) =>
    normalizePackage(
      await apiRequest<any>(`/packages/${id}/tracking`, {
        method: 'POST',
        body: JSON.stringify(event),
      })
    ),
};

export const contactApi = {
  submit: (data: ContactFormData) =>
    apiRequest<{ id: string; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const newsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return apiRequest<{ articles: NewsArticle[]; total: number; page: number; totalPages: number }>(
      `/news${queryParams ? `?${queryParams}` : ''}`
    );
  },
  getById: (id: string) => apiRequest<NewsArticle>(`/news/${id}`),
  adminCreate: (data: NewsUpsertData) =>
    apiRequest<NewsArticle>('/admin/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  adminUpdate: (id: string, data: Partial<NewsUpsertData>) =>
    apiRequest<NewsArticle>(`/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  adminDelete: (id: string) =>
    apiRequest<{ message: string }>(`/admin/news/${id}`, {
      method: 'DELETE',
    }),
};

export const careerApi = {
  getAll: () => apiRequest<JobPosting[]>('/careers'),
  apply: (jobId: string, data: JobApplicationData) =>
    apiRequest<{ message: string; applicationId: string }>(`/careers/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  adminCreate: (data: JobUpsertData) =>
    apiRequest<JobPosting>('/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  adminUpdate: (id: string, data: Partial<JobUpsertData>) =>
    apiRequest<JobPosting>(`/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  adminDelete: (id: string) =>
    apiRequest<{ message: string }>(`/admin/jobs/${id}`, {
      method: 'DELETE',
    }),
  adminGetApplications: (params?: { jobId?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return apiRequest<{ applications: JobApplicationRecord[]; total: number; page: number; totalPages: number }>(
      `/admin/applications${queryParams ? `?${queryParams}` : ''}`
    );
  },
  adminUpdateApplicationStatus: (id: string, status: ApplicationStatus) =>
    apiRequest<JobApplicationRecord>(`/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  adminExportApplicationsCsv: async (params?: { jobId?: string; search?: string }) => {
    const queryParams = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await fetch(
      `${API_BASE_URL}/admin/applications/export.csv${queryParams ? `?${queryParams}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export applications CSV');
    }

    return response.blob();
  },
};

export const serviceApi = {
  getAll: () => apiRequest<Service[]>('/services'),
  getById: (id: string) => apiRequest<Service>(`/services/${id}`),
};

export const newsletterApi = {
  subscribe: (email: string) =>
    apiRequest<{ message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};
