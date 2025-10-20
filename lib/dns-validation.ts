/**
 * DNS record validation utilities
 */

export type DNSRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validates an IPv4 address
 */
export function validateIPv4(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip.trim());
}

/**
 * Validates an IPv6 address
 */
export function validateIPv6(ip: string): boolean {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  // More comprehensive IPv6 validation
  const expandedRegex = /^(?:(?:[0-9a-fA-F]{1,4}:)*)?(?:(?:[0-9a-fA-F]{1,4})?::(?:[0-9a-fA-F]{1,4}:)*)?(?:[0-9a-fA-F]{1,4})?$/;
  return ipv6Regex.test(ip.trim()) || expandedRegex.test(ip.trim());
}

/**
 * Validates a domain name for CNAME records
 */
export function validateDomain(domain: string): boolean {
  if (!domain || domain.length === 0) return false;
  
  // Remove trailing dot if present (valid in DNS)
  const cleanDomain = domain.trim().replace(/\.$/, '');
  
  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Check length constraints
  if (cleanDomain.length > 253) return false;
  
  // Check each label length (max 63 chars per label)
  const labels = cleanDomain.split('.');
  for (const label of labels) {
    if (label.length > 63) return false;
  }
  
  return domainRegex.test(cleanDomain);
}

/**
 * Validates a TXT record value
 */
export function validateTXT(value: string): boolean {
  if (!value) return false;
  
  // TXT records can contain almost any text, but have length limits
  // Maximum length for a single TXT record string is 255 characters
  // Multiple strings can be concatenated for longer records
  return value.length > 0 && value.length <= 1024; // Allow reasonable length
}

/**
 * Validates DNS record based on type and value
 */
export function validateDNSRecord(type: DNSRecordType, value: string): ValidationResult {
  const trimmedValue = value.trim();
  
  if (!trimmedValue) {
    return {
      isValid: false,
      message: 'Value cannot be empty'
    };
  }
  
  switch (type) {
    case 'A':
      if (!validateIPv4(trimmedValue)) {
        return {
          isValid: false,
          message: 'Invalid IPv4 address format (e.g., 192.168.1.1)'
        };
      }
      break;
      
    case 'AAAA':
      if (!validateIPv6(trimmedValue)) {
        return {
          isValid: false,
          message: 'Invalid IPv6 address format (e.g., 2001:db8::1)'
        };
      }
      break;
      
    case 'CNAME':
      if (!validateDomain(trimmedValue)) {
        return {
          isValid: false,
          message: 'Invalid domain name format (e.g., example.com)'
        };
      }
      break;
      
    case 'TXT':
      if (!validateTXT(trimmedValue)) {
        return {
          isValid: false,
          message: 'TXT record cannot be empty and must be under 1024 characters'
        };
      }
      break;
      
    default:
      return {
        isValid: false,
        message: 'Unsupported record type'
      };
  }
  
  return {
    isValid: true,
    message: 'Valid'
  };
}

/**
 * Get example value for DNS record type
 */
export function getDNSRecordExample(type: DNSRecordType): string {
  switch (type) {
    case 'A':
      return '192.168.1.1';
    case 'AAAA':
      return '2001:db8::1';
    case 'CNAME':
      return 'example.com';
    case 'TXT':
      return 'v=spf1 include:_spf.google.com ~all';
    default:
      return '';
  }
}

/**
 * Get description for DNS record type
 */
export function getDNSRecordDescription(type: DNSRecordType): string {
  switch (type) {
    case 'A':
      return 'Points to an IPv4 address';
    case 'AAAA':
      return 'Points to an IPv6 address';
    case 'CNAME':
      return 'Points to another domain name';
    case 'TXT':
      return 'Contains text information (SPF, verification, etc.)';
    default:
      return '';
  }
}