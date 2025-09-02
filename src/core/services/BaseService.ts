import { EventEmitter } from 'events';

export interface ServiceConfig {
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export type Result<T, E = ServiceError> = 
  | { success: true; data: T }
  | { success: false; error: E };

export abstract class BaseService extends EventEmitter {
  protected config: ServiceConfig;
  protected isInitialized: boolean = false;
  
  constructor(config: ServiceConfig = {}) {
    super();
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };
  }
  
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    await this.onInitialize();
    this.isInitialized = true;
    this.emit('initialized');
  }
  
  protected abstract onInitialize(): Promise<void>;
  
  async dispose(): Promise<void> {
    if (!this.isInitialized) return;
    
    await this.onDispose();
    this.isInitialized = false;
    this.emit('disposed');
  }
  
  protected abstract onDispose(): Promise<void>;
  
  protected async retry<T>(
    operation: () => Promise<T>,
    attempts: number = this.config.retryAttempts!,
    delay: number = this.config.retryDelay!
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (i < attempts - 1) {
          await this.sleep(delay * Math.pow(2, i));
        }
      }
    }
    
    throw lastError;
  }
  
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  protected createError(code: string, message: string, details?: any): ServiceError {
    return {
      code,
      message,
      details,
      timestamp: new Date()
    };
  }
  
  protected handleError(error: any): ServiceError {
    if (error.code && error.message) {
      return error;
    }
    
    if (error instanceof Error) {
      return this.createError(
        'UNKNOWN_ERROR',
        error.message,
        { stack: error.stack }
      );
    }
    
    return this.createError(
      'UNKNOWN_ERROR',
      'An unknown error occurred',
      error
    );
  }
}

export abstract class CrudService<T, CreateDTO, UpdateDTO> extends BaseService {
  abstract create(data: CreateDTO): Promise<Result<T>>;
  abstract findById(id: string): Promise<Result<T>>;
  abstract findAll(filter?: any): Promise<Result<T[]>>;
  abstract update(id: string, data: UpdateDTO): Promise<Result<T>>;
  abstract delete(id: string): Promise<Result<void>>;
  
  async findMany(ids: string[]): Promise<Result<T[]>> {
    const results = await Promise.all(
      ids.map(id => this.findById(id))
    );
    
    const errors = results.filter(r => !r.success);
    if (errors.length > 0) {
      return {
        success: false,
        error: this.createError(
          'BATCH_FETCH_ERROR',
          `Failed to fetch ${errors.length} items`,
          errors
        )
      };
    }
    
    return {
      success: true,
      data: results.map(r => (r as any).data)
    };
  }
  
  async deleteMany(ids: string[]): Promise<Result<void>> {
    const results = await Promise.all(
      ids.map(id => this.delete(id))
    );
    
    const errors = results.filter(r => !r.success);
    if (errors.length > 0) {
      return {
        success: false,
        error: this.createError(
          'BATCH_DELETE_ERROR',
          `Failed to delete ${errors.length} items`,
          errors
        )
      };
    }
    
    return { success: true, data: undefined };
  }
}