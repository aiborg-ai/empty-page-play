type ServiceFactory<T> = () => T;
type ServiceResolver<T> = () => Promise<T>;

interface ServiceDescriptor<T> {
  factory: ServiceFactory<T> | ServiceResolver<T>;
  singleton: boolean;
  instance?: T;
}

export class ServiceContainer {
  private static instance: ServiceContainer;
  private services = new Map<string | symbol, ServiceDescriptor<any>>();
  
  private constructor() {}
  
  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }
  
  register<T>(
    token: string | symbol,
    factory: ServiceFactory<T> | ServiceResolver<T>,
    options: { singleton?: boolean } = {}
  ): void {
    this.services.set(token, {
      factory,
      singleton: options.singleton ?? true,
      instance: undefined
    });
  }
  
  registerSingleton<T>(token: string | symbol, instance: T): void {
    this.services.set(token, {
      factory: () => instance,
      singleton: true,
      instance
    });
  }
  
  registerTransient<T>(
    token: string | symbol,
    factory: ServiceFactory<T>
  ): void {
    this.register(token, factory, { singleton: false });
  }
  
  resolve<T>(token: string | symbol): T {
    const descriptor = this.services.get(token);
    
    if (!descriptor) {
      throw new Error(`Service '${String(token)}' not registered`);
    }
    
    if (descriptor.singleton && descriptor.instance) {
      return descriptor.instance;
    }
    
    const instance = descriptor.factory();
    
    if (descriptor.singleton) {
      descriptor.instance = instance;
    }
    
    return instance;
  }
  
  async resolveAsync<T>(token: string | symbol): Promise<T> {
    const descriptor = this.services.get(token);
    
    if (!descriptor) {
      throw new Error(`Service '${String(token)}' not registered`);
    }
    
    if (descriptor.singleton && descriptor.instance) {
      return descriptor.instance;
    }
    
    const instance = await descriptor.factory();
    
    if (descriptor.singleton) {
      descriptor.instance = instance;
    }
    
    return instance;
  }
  
  has(token: string | symbol): boolean {
    return this.services.has(token);
  }
  
  clear(): void {
    this.services.clear();
  }
  
  createScope(): ServiceContainer {
    const scoped = new ServiceContainer();
    this.services.forEach((descriptor, token) => {
      if (!descriptor.singleton) {
        scoped.services.set(token, {
          ...descriptor,
          instance: undefined
        });
      } else {
        scoped.services.set(token, descriptor);
      }
    });
    return scoped;
  }
}

export const container = ServiceContainer.getInstance();