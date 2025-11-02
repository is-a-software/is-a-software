/**
 * Type definitions for the is-a-software platform
 * Provides comprehensive type safety across the application
 */

// User and Authentication Types
export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  reloadUserInfo?: {
    screenName?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

// Domain and Subdomain Types
export interface DomainConfig {
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT';
  value: string;
  ttl?: number;
  proxied?: boolean;
}

export interface Domain {
  name: string;
  owner: string;
  config: DomainConfig;
  status: 'active' | 'pending' | 'error' | 'disabled';
  createdAt: string;
  updatedAt?: string;
  lastChecked?: string;
  error?: string;
}

export interface DomainStatus {
  domain: string;
  status: 'active' | 'pending' | 'error';
  lastChecked: string;
  error?: string;
  config?: DomainConfig;
}

// Activity and Stats Types
export interface Activity {
  id: string;
  type: 'domain_created' | 'domain_updated' | 'domain_deleted' | 'status_check' | 'dns_validation';
  domain: string;
  user: string;
  timestamp: string;
  details?: Record<string, any>;
  metadata?: {
    ip?: string;
    userAgent?: string;
    source?: string;
  };
}

export interface Stats {
  totalDomains: number;
  activeDomains: number;
  totalUsers: number;
  recentActivity: number;
  statusDistribution: {
    active: number;
    pending: number;
    error: number;
    disabled: number;
  };
  recordTypeDistribution: {
    A: number;
    AAAA: number;
    CNAME: number;
    TXT: number;
  };
}

export interface PublicStats {
  totalDomains: number;
  activeDomains: number;
  totalUsers: number;
  uptime: string;
  lastUpdated: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  code?: string | number;
  details?: Record<string, any>;
}

// DNS and Validation Types
export interface DnsValidationResult {
  valid: boolean;
  records: Array<{
    type: string;
    value: string;
    ttl?: number;
  }>;
  error?: string;
  timestamp: string;
}

export interface ValidationErrorInfo {
  field: string;
  message: string;
  code?: string;
}

// Dashboard Types
export interface DashboardData {
  domains: Domain[];
  stats: Stats;
  recentActivity: Activity[];
  loading: boolean;
  error: string | null;
}

// Form Types
export interface CreateDomainForm {
  subdomain: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT';
  value: string;
  ttl?: number;
}

export interface UpdateDomainForm extends Partial<CreateDomainForm> {
  name: string;
}

// Hook Types
export interface UseApiState {
  loading: boolean;
  error: string | null;
  execute: <T = any>(
    endpoint: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      requireAuth?: boolean;
    }
  ) => Promise<T>;
}

export interface UseDashboardDataState extends DashboardData {
  refreshDomains: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshActivity: () => Promise<void>;
  checkDomainStatus: (domain: string) => Promise<void>;
  deleteDomain: (domain: string) => Promise<void>;
}

export interface UseConfirmationState {
  isOpen: boolean;
  loading: boolean;
  confirm: (options: {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
  }) => Promise<boolean>;
  ConfirmationDialog: React.ComponentType;
}

// Component Props Types
export interface NavbarProps {
  currentPage?: 'home' | 'about' | 'docs' | 'api' | 'endpoint' | 'dashboard' | 'login' | 'privacy' | 'terms';
}

export interface DomainCardProps {
  domain: Domain;
  onStatusCheck?: (domain: string) => void;
  onDelete?: (domain: string) => void;
  onUpdate?: (domain: string) => void;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
}

// GitHub API Types (for documentation)
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  stargazers_count: number;
  forks_count: number;
  language?: string;
  updated_at: string;
  topics: string[];
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
    description?: string;
  }>;
}

// Utility Types
export type PageName = 'home' | 'about' | 'docs' | 'api' | 'endpoint' | 'dashboard' | 'login' | 'privacy' | 'terms';

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT';

export type DomainStatusType = 'active' | 'pending' | 'error' | 'disabled';

export type ActivityType = 'domain_created' | 'domain_updated' | 'domain_deleted' | 'status_check' | 'dns_validation';

// Error Types
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    details?: Record<string, any>
  ) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

// Constants
export const DNS_RECORD_TYPES: DnsRecordType[] = ['A', 'AAAA', 'CNAME', 'TXT'];

export const DOMAIN_STATUS_COLORS = {
  active: 'text-green-600',
  pending: 'text-yellow-600',
  error: 'text-red-600',
  disabled: 'text-gray-600'
} as const;

export const ACTIVITY_TYPE_LABELS = {
  domain_created: 'Domain Created',
  domain_updated: 'Domain Updated',
  domain_deleted: 'Domain Deleted',
  status_check: 'Status Check',
  dns_validation: 'DNS Validation'
} as const;