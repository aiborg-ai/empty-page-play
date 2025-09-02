import { useState, useEffect } from 'react';
import { container } from '../di/ServiceContainer';
import { ServiceToken } from '../di/ServiceTokens';

export function useServiceContainer() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    setIsReady(true);
  }, []);
  
  return { isReady, container };
}

export function useService<T>(token: ServiceToken | string): T | null {
  const [service, setService] = useState<T | null>(null);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const instance = await container.resolveAsync<T>(token);
        setService(instance);
      } catch (err) {
        setError(err as Error);
        console.error(`Failed to resolve service ${String(token)}:`, err);
      } finally {
        setLoading(false);
      }
    };
    
    loadService();
  }, [token]);
  
  return service;
}

export function useServices<T extends Record<string, any>>(
  tokens: Record<keyof T, ServiceToken | string>
): { services: Partial<T>; loading: boolean; error: Error | null } {
  const [services, setServices] = useState<Partial<T>>({});
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const entries = Object.entries(tokens) as Array<[keyof T, ServiceToken | string]>;
        const resolved = await Promise.all(
          entries.map(async ([key, token]) => {
            const service = await container.resolveAsync(token);
            return [key, service];
          })
        );
        
        const serviceMap = Object.fromEntries(resolved) as T;
        setServices(serviceMap);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to resolve services:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, []);
  
  return { services, loading: _loading, error: _error };
}