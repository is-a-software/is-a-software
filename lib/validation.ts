/**
 * Input validation schemas for API security
 * Prevents injection attacks and ensures data integrity
 */

// Basic validation functions (avoiding external dependencies for security)

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validates and sanitizes subdomain names
 */
export function validateSubdomain(name: unknown): ValidationResult {
  if (typeof name !== 'string') {
    return { isValid: false, error: 'Subdomain must be a string' };
  }

  // Remove any whitespace
  const trimmed = name.trim();

  // Check length
  if (trimmed.length < 1 || trimmed.length > 63) {
    return { isValid: false, error: 'Subdomain must be between 1 and 63 characters' };
  }

  // Check for valid characters (alphanumeric and hyphens only)
  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' };
  }

  // Cannot start or end with hyphen
  if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
    return { isValid: false, error: 'Subdomain cannot start or end with a hyphen' };
  }

  // Cannot contain consecutive hyphens
  if (trimmed.includes('--')) {
    return { isValid: false, error: 'Subdomain cannot contain consecutive hyphens' };
  }

  // Reserved names
  const reserved = ['api', 'www', 'mail', 'ftp', 'admin', 'root', 'test', 'staging'];
  if (reserved.includes(trimmed)) {
    return { isValid: false, error: 'This subdomain name is reserved' };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validates DNS record types
 */
export function validateDNSRecordType(type: unknown): ValidationResult {
  if (typeof type !== 'string') {
    return { isValid: false, error: 'DNS record type must be a string' };
  }

  const validTypes = ['A', 'AAAA', 'CNAME', 'TXT'];
  const upperType = type.trim().toUpperCase();

  if (!validTypes.includes(upperType)) {
    return { isValid: false, error: 'Invalid DNS record type. Must be A, AAAA, CNAME, or TXT' };
  }

  return { isValid: true, sanitized: upperType };
}

/**
 * Validates DNS record values based on type
 */
export function validateDNSRecordValue(value: unknown, type: string): ValidationResult {
  if (typeof value !== 'string') {
    return { isValid: false, error: 'DNS record value must be a string' };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'DNS record value cannot be empty' };
  }

  if (trimmed.length > 4096) { // DNS TXT records can be quite long
    return { isValid: false, error: 'DNS record value is too long' };
  }

  switch (type) {
    case 'A': {
      // IPv4 validation
      const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipv4Regex.test(trimmed)) {
        return { isValid: false, error: 'Invalid IPv4 address format' };
      }
      break;
    }

    case 'AAAA': {
      // IPv6 validation (simplified)
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
      if (!ipv6Regex.test(trimmed)) {
        return { isValid: false, error: 'Invalid IPv6 address format' };
      }
      break;
    }

    case 'CNAME': {
      // Domain name validation
      if (trimmed.match(/^https?:\/\//i)) {
        return { isValid: false, error: 'CNAME cannot contain HTTP/HTTPS protocol' };
      }
      
      // Remove trailing dot if present (valid in DNS)
      const cleanDomain = trimmed.replace(/\.$/, '');
      
      if (cleanDomain.length > 253) {
        return { isValid: false, error: 'Domain name is too long' };
      }

      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!domainRegex.test(cleanDomain)) {
        return { isValid: false, error: 'Invalid domain name format' };
      }
      break;
    }

    case 'TXT': {
      // TXT records can contain various data, but we should sanitize for safety
      if (trimmed.length > 255) {
        return { isValid: false, error: 'TXT record value cannot exceed 255 characters' };
      }
      
      // Check for potentially dangerous content
      if (trimmed.includes('<script') || trimmed.includes('javascript:')) {
        return { isValid: false, error: 'TXT record contains potentially dangerous content' };
      }
      break;
    }

    default:
      return { isValid: false, error: 'Unknown DNS record type' };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validates GitHub usernames
 */
export function validateGitHubUsername(username: unknown): ValidationResult {
  if (typeof username !== 'string') {
    return { isValid: false, error: 'GitHub username must be a string' };
  }

  const trimmed = username.trim();

  // GitHub username constraints
  if (trimmed.length < 1 || trimmed.length > 39) {
    return { isValid: false, error: 'GitHub username must be between 1 and 39 characters' };
  }

  // Can only contain alphanumeric characters and hyphens
  // Cannot start or end with hyphen
  // Cannot have consecutive hyphens
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
    return { isValid: false, error: 'Invalid GitHub username format' };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Sanitizes general string input
 */
export function sanitizeString(input: unknown, maxLength = 1000): ValidationResult {
  if (typeof input !== 'string') {
    return { isValid: false, error: 'Input must be a string' };
  }

  // Remove null bytes and control characters
  const sanitized = input.replace(/[\x00-\x1F\x7F]/g, '').trim();

  if (sanitized.length > maxLength) {
    return { isValid: false, error: `Input too long (max ${maxLength} characters)` };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates request body structure
 */
export function validateRequestBody(body: unknown, requiredFields: string[]): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be an object' };
  }

  const obj = body as Record<string, unknown>;

  // Check for required fields
  for (const field of requiredFields) {
    if (!(field in obj)) {
      return { isValid: false, error: `Missing required field: ${field}` };
    }
  }

  // Check for suspicious extra fields
  const allowedFields = [...requiredFields, 'ttl', 'proxy']; // Some optional fields
  const extraFields = Object.keys(obj).filter(key => !allowedFields.includes(key));
  
  if (extraFields.length > 0) {
    return { isValid: false, error: `Unexpected fields: ${extraFields.join(', ')}` };
  }

  return { isValid: true };
}