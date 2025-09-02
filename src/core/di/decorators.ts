import 'reflect-metadata';
import { container } from './ServiceContainer';
import { ServiceToken } from './ServiceTokens';

export function Injectable(token?: ServiceToken | string) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    const serviceToken = token || constructor.name;
    container.register(serviceToken, () => new constructor());
    return constructor;
  };
}

export function Singleton(token?: ServiceToken | string) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    const serviceToken = token || constructor.name;
    container.register(serviceToken, () => new constructor(), { singleton: true });
    return constructor;
  };
}

export function Transient(token?: ServiceToken | string) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    const serviceToken = token || constructor.name;
    container.registerTransient(serviceToken, () => new constructor());
    return constructor;
  };
}

export function Inject(token: ServiceToken | string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex?: number) {
    if (parameterIndex !== undefined) {
      const existingTokens = Reflect.getMetadata?.('inject:tokens', target) || [];
      existingTokens[parameterIndex] = token;
      Reflect.defineMetadata?.('inject:tokens', existingTokens, target);
    } else {
      Object.defineProperty(target, propertyKey, {
        get: () => container.resolve(token),
        enumerable: true,
        configurable: true
      });
    }
  };
}

export function Factory<T>(token: ServiceToken | string, factory: () => T) {
  container.register(token, factory);
  return factory;
}