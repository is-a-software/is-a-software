/**
 * Utility functions for common operations
 * Centralizes reusable logic with proper error handling and type safety
 */

/**
 * Safely extracts GitHub login from Firebase user object
 */
export function getGithubLogin(user: { reloadUserInfo?: { screenName?: string }; email?: string } | null): string | undefined {
  return user?.reloadUserInfo?.screenName || 
         (user?.email ? user.email.split('@')[0] : undefined);
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

/**
 * Formats a relative time string (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(d);
}

/**
 * Validates subdomain name format
 */
export function validateSubdomain(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name) {
    return { valid: false, error: 'Subdomain name is required' };
  }
  
  if (name.length < 3) {
    return { valid: false, error: 'Subdomain must be at least 3 characters long' };
  }
  
  if (name.length > 63) {
    return { valid: false, error: 'Subdomain must be 63 characters or less' };
  }
  
  if (!/^[a-z0-9-]+$/.test(name)) {
    return { valid: false, error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' };
  }
  
  if (name.startsWith('-') || name.endsWith('-')) {
    return { valid: false, error: 'Subdomain cannot start or end with a hyphen' };
  }
  
  if (name.includes('--')) {
    return { valid: false, error: 'Subdomain cannot contain consecutive hyphens' };
  }
  
  return { valid: true };
}

/**
 * Validates DNS record values
 */
export function validateDnsRecord(type: string, value: string): {
  valid: boolean;
  error?: string;
} {
  const trimmedValue = value.trim();
  
  if (!trimmedValue) {
    return { valid: false, error: 'DNS record value is required' };
  }
  
  switch (type.toUpperCase()) {
    case 'A':
      // IPv4 address validation
      const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipv4Regex.test(trimmedValue)) {
        return { valid: false, error: 'Invalid IPv4 address format' };
      }
      break;
      
    case 'AAAA':
      // IPv6 address validation (simplified)
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
      if (!ipv6Regex.test(trimmedValue)) {
        return { valid: false, error: 'Invalid IPv6 address format' };
      }
      break;
      
    case 'CNAME':
      if (trimmedValue.match(/^https?:\/\//i)) {
        return { valid: false, error: 'CNAME cannot contain http:// or https://' };
      }
      if (trimmedValue.match(/\/|\?|#/)) {
        return { valid: false, error: 'CNAME cannot contain paths, query parameters, or fragments' };
      }
      // Basic hostname validation
      const hostnameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!hostnameRegex.test(trimmedValue)) {
        return { valid: false, error: 'Invalid hostname format' };
      }
      break;
      
    case 'TXT':
      if (trimmedValue.length > 255) {
        return { valid: false, error: 'TXT record cannot exceed 255 characters' };
      }
      break;
      
    default:
      return { valid: false, error: `Unsupported DNS record type: ${type}` };
  }
  
  return { valid: true };
}

/**
 * Debounce function for limiting API calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

/**
 * Creates a promise that resolves after a specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T = unknown>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Formats bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncates text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}