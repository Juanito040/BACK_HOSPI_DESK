import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Ticket,
  CreateTicketRequest,
  UpdateTicketStatusRequest,
  AssignTicketRequest,
  Comment,
  CreateCommentRequest,
  Attachment,
  Area,
  SLA,
  AuditTrail,
  PaginatedResponse,
  TicketFilters,
  User,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
          const currentPath = window.location.pathname;

          // Only redirect if not on a public page
          if (!publicPaths.includes(currentPath)) {
            console.log('[ApiService] 401 error - redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          } else {
            console.log('[ApiService] 401 error on public page - not redirecting');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('[ApiService] Sending login request to:', `${API_BASE_URL}/auth/login`);
    const response = await this.api.post<AuthResponse>('/auth/login', data);
    console.log('[ApiService] Login response:', response.data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('[ApiService] Sending register request to:', `${API_BASE_URL}/auth/register`);
    console.log('[ApiService] Register data:', { ...data, password: '***' });
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    console.log('[ApiService] Register response:', response.data);
    return response.data;
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await this.api.post('/auth/request-password-reset', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await this.api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }

  // Ticket endpoints
  async getTickets(filters?: TicketFilters): Promise<PaginatedResponse<Ticket>> {
    const response = await this.api.get<PaginatedResponse<Ticket>>('/tickets', {
      params: filters,
    });
    return response.data;
  }

  async getTicketById(id: string): Promise<any> {
    const response = await this.api.get<any>(`/tickets/${id}`);
    // Backend returns { ticket, comments, attachments }
    return response.data;
  }

  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    const response = await this.api.post<Ticket>('/tickets', data);
    return response.data;
  }

  async updateTicketStatus(id: string, data: UpdateTicketStatusRequest): Promise<Ticket> {
    const response = await this.api.patch<Ticket>(`/tickets/${id}/status`, data);
    return response.data;
  }

  async assignTicket(id: string, data: AssignTicketRequest): Promise<Ticket> {
    const response = await this.api.patch<Ticket>(`/tickets/${id}/assign`, data);
    return response.data;
  }

  // Comment endpoints
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await this.api.post<Comment>('/comments', data);
    return response.data;
  }

  // Attachment endpoints
  async uploadAttachment(ticketId: string, file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post<Attachment>(
      `/attachments/upload/${ticketId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteAttachment(attachmentId: string): Promise<void> {
    await this.api.delete(`/attachments/${attachmentId}`);
  }

  getAttachmentDownloadUrl(attachmentId: string): string {
    return `${API_BASE_URL}/attachments/download?attachmentId=${attachmentId}`;
  }

  // Area endpoints
  async getAreas(activeOnly?: boolean): Promise<Area[]> {
    const response = await this.api.get<Area[]>('/areas', {
      params: { activeOnly },
    });
    return response.data;
  }

  async getAreaById(id: string): Promise<Area> {
    const response = await this.api.get<Area>(`/areas/${id}`);
    return response.data;
  }

  async createArea(data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>): Promise<Area> {
    const response = await this.api.post<Area>('/areas', data);
    return response.data;
  }

  async updateArea(id: string, data: Partial<Area>): Promise<Area> {
    const response = await this.api.put<Area>(`/areas/${id}`, data);
    return response.data;
  }

  async deleteArea(id: string): Promise<void> {
    await this.api.delete(`/areas/${id}`);
  }

  // SLA endpoints
  async getSLAs(areaId?: string): Promise<SLA[]> {
    const response = await this.api.get<SLA[]>('/slas', {
      params: { areaId },
    });
    return response.data;
  }

  async getSLAById(id: string): Promise<SLA> {
    const response = await this.api.get<SLA>(`/slas/${id}`);
    return response.data;
  }

  async createSLA(data: Omit<SLA, 'id' | 'area' | 'createdAt' | 'updatedAt'>): Promise<SLA> {
    const response = await this.api.post<SLA>('/slas', data);
    return response.data;
  }

  async updateSLA(id: string, data: Partial<SLA>): Promise<SLA> {
    const response = await this.api.put<SLA>(`/slas/${id}`, data);
    return response.data;
  }

  async deleteSLA(id: string): Promise<void> {
    await this.api.delete(`/slas/${id}`);
  }

  // Audit endpoints
  async getTicketAuditTrail(ticketId: string): Promise<AuditTrail[]> {
    const response = await this.api.get<AuditTrail[]>(`/audit/ticket/${ticketId}`);
    return response.data;
  }

  async getActorAuditTrail(actorId: string): Promise<AuditTrail[]> {
    const response = await this.api.get<AuditTrail[]>(`/audit/actor/${actorId}`);
    return response.data;
  }

  // User endpoints
  async getUsers(filters?: { role?: string; areaId?: string; activeOnly?: boolean }): Promise<User[]> {
    const response = await this.api.get<User[]>('/users', {
      params: filters,
    });
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get<User>(`/users/${id}`);
    return response.data;
  }

  async createUser(data: { name: string; email: string; password: string; phone?: string; role: string; areaId?: string }): Promise<User> {
    const response = await this.api.post<User>('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: { name?: string; email?: string; password?: string; phone?: string; role?: string; areaId?: string; isActive?: boolean }): Promise<User> {
    const response = await this.api.put<User>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Get current user (from token)
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const apiService = new ApiService();
