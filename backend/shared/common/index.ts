// Common utility functions and configurations
import crypto from 'crypto';

// Crypto utilities
export class CryptoUtils {
  static generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { publicKey, privateKey };
  }

  static signData(data: string, privateKey: string): string {
    const sign = crypto.createSign('sha256');
    sign.update(data);
    return sign.sign(privateKey, 'base64');
  }

  static verifySignature(data: string, signature: string, publicKey: string): boolean {
    const verify = crypto.createVerify('sha256');
    verify.update(data);
    return verify.verify(publicKey, signature, 'base64');
  }

  static generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static generateVerificationCode(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}

// Database utilities
export class DatabaseUtils {
  static createConnectionString(config: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
  }): string {
    const sslParam = config.ssl ? '?sslmode=require' : '';
    return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}${sslParam}`;
  }
}

// Validation utilities
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static isValidCGPA(cgpa: number): boolean {
    return cgpa >= 0 && cgpa <= 10;
  }

  static isValidGrade(grade: string): boolean {
    const validGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
    return validGrades.includes(grade);
  }
}

// Logger utility
export class Logger {
  static info(message: string, meta?: any): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta || '');
  }

  static error(message: string, error?: Error): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '');
  }

  static warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta || '');
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta || '');
    }
  }
}

// HTTP response utilities
export class ResponseUtils {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message: message || 'Operation successful'
    };
  }

  static error(message: string, code?: string, details?: any) {
    return {
      success: false,
      error: {
        code: code || 'UNKNOWN_ERROR',
        message,
        details,
        timestamp: new Date()
      }
    };
  }

  static paginated<T>(data: T[], page: number, limit: number, total: number) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

// Environment configuration
export class Config {
  static get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }

  static getNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    return value ? parseInt(value, 10) : (defaultValue || 0);
  }

  static getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = process.env[key];
    return value ? value.toLowerCase() === 'true' : (defaultValue || false);
  }

  static required(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
  }
}

// Constants
export const Constants = {
  ROLES: {
    UNIVERSITY: 'university',
    STUDENT: 'student', 
    EMPLOYER: 'employer',
    ADMIN: 'admin'
  },
  CERTIFICATE_STATUS: {
    ACTIVE: 'active',
    REVOKED: 'revoked',
    SUSPENDED: 'suspended'
  },
  VERIFICATION_METHODS: {
    API: 'api',
    MANUAL: 'manual',
    CODE: 'code'
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  }
} as const;