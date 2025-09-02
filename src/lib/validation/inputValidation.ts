/**
 * Input Validation Service
 * Provides comprehensive input validation and sanitization
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */
export const ValidationSchemas = {
  // User input schemas
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  
  username: z.string()
    .min(3, 'Username too short')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username contains invalid characters'),
  
  // Search and query schemas
  searchQuery: z.string()
    .max(200, 'Search query too long')
    .transform(val => val.trim())
    .refine(val => !/<script/i.test(val), 'Invalid characters in search'),
  
  // ID schemas
  uuid: z.string().uuid('Invalid ID format'),
  
  numericId: z.string().regex(/^\d+$/, 'Invalid numeric ID'),
  
  // Content schemas
  title: z.string()
    .min(1, 'Title required')
    .max(200, 'Title too long')
    .transform(val => sanitizeHtml(val)),
  
  description: z.string()
    .max(5000, 'Description too long')
    .transform(val => sanitizeHtml(val)),
  
  url: z.string().url('Invalid URL format').max(2000),
  
  // File upload schemas
  fileName: z.string()
    .max(255, 'Filename too long')
    .regex(/^[^<>:"/\\|?*]+$/, 'Invalid filename characters'),
  
  mimeType: z.enum([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/json',
    'application/xml'
  ]),
  
  // Pagination schemas
  page: z.number().int().min(1).max(10000),
  
  limit: z.number().int().min(1).max(100),
  
  // Date schemas
  dateString: z.string().datetime('Invalid date format'),
  
  // API key schema
  apiKey: z.string()
    .min(20, 'Invalid API key')
    .max(200, 'Invalid API key')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid API key format')
};

/**
 * SQL injection prevention patterns
 */
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE|ORDER BY|GROUP BY|HAVING)\b)/i,
  /(--|\/\*|\*\/|xp_|sp_|0x)/i,
  /('|"|;|\\)/g
];

/**
 * XSS prevention - basic HTML sanitization
 */
function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Check for SQL injection attempts
 */
export function hasSqlInjectionRisk(input: string): boolean {
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Sanitize input for database queries
 */
export function sanitizeForDatabase(input: string): string {
  if (hasSqlInjectionRisk(input)) {
    throw new Error('Potentially malicious input detected');
  }
  
  // Additional escaping for database
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .trim();
}

/**
 * Create a validated API endpoint schema
 */
export function createApiSchema<T extends z.ZodType>(
  body?: T,
  query?: Record<string, z.ZodType>,
  params?: Record<string, z.ZodType>
) {
  return z.object({
    body: body || z.undefined(),
    query: query ? z.object(query) : z.undefined(),
    params: params ? z.object(params) : z.undefined()
  });
}

/**
 * Validate and sanitize form data
 */
export class FormValidator<T extends z.ZodType> {
  constructor(private schema: T) {}
  
  validate(data: unknown): z.infer<T> {
    try {
      return this.schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          'Validation failed',
          error.issues.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        );
      }
      throw error;
    }
  }
  
  validatePartial(data: unknown): Partial<z.infer<T>> {
    // Type assertion needed as TypeScript doesn't know T extends ZodObject
    const partialSchema = (this.schema as any).partial();
    return partialSchema.parse(data);
  }
  
  getFieldError(error: unknown, field: string): string | null {
    if (error instanceof ValidationError) {
      const fieldError = error.errors.find(e => e.field === field);
      return fieldError?.message || null;
    }
    return null;
  }
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Rate limiting validator
 */
export class RateLimiter {
  private attempts = new Map<string, number[]>();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  check(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Clean old attempts
    const recentAttempts = userAttempts.filter(
      time => now - time < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * File upload validator
 */
export class FileUploadValidator {
  constructor(
    private maxSizeMB: number = 10,
    private allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
  ) {}
  
  validate(file: File): void {
    // Check file size
    const maxBytes = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new ValidationError('File too large', [
        { field: 'file', message: `Maximum size is ${this.maxSizeMB}MB` }
      ]);
    }
    
    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      throw new ValidationError('Invalid file type', [
        { field: 'file', message: `Allowed types: ${this.allowedTypes.join(', ')}` }
      ]);
    }
    
    // Check filename
    ValidationSchemas.fileName.parse(file.name);
  }
}

/**
 * Patent-specific validators
 */
export const PatentValidators = {
  patentNumber: z.string().regex(
    /^[A-Z]{2}\d{7,}$/,
    'Invalid patent number format'
  ),
  
  applicationNumber: z.string().regex(
    /^\d{2}\/\d{3},\d{3}$/,
    'Invalid application number format'
  ),
  
  claimText: z.string()
    .min(10, 'Claim text too short')
    .max(50000, 'Claim text too long')
    .transform(val => sanitizeHtml(val)),
  
  ipcCode: z.string().regex(
    /^[A-H]\d{2}[A-Z]\d{1,4}\/\d{2,4}$/,
    'Invalid IPC code format'
  ),
  
  cpcCode: z.string().regex(
    /^[A-HY]\d{2}[A-Z]\d{1,4}\/\d{2,6}$/,
    'Invalid CPC code format'
  )
};

/**
 * Export convenience functions
 */
export const validate = {
  email: (value: string) => ValidationSchemas.email.parse(value),
  password: (value: string) => ValidationSchemas.password.parse(value),
  searchQuery: (value: string) => ValidationSchemas.searchQuery.parse(value),
  uuid: (value: string) => ValidationSchemas.uuid.parse(value),
  url: (value: string) => ValidationSchemas.url.parse(value),
  patentNumber: (value: string) => PatentValidators.patentNumber.parse(value)
};

// Export rate limiter instance
export const authRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute
export const apiRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute