import { container } from './ServiceContainer';
import { ServiceTokens } from './ServiceTokens';
import { supabase } from '@/lib/supabase';
import { PatentService } from '../services/PatentService';

export function registerServices() {
  // Register Supabase client
  container.registerSingleton(ServiceTokens.SupabaseClient, supabase);
  
  // Register core services
  container.register(ServiceTokens.PatentService, () => new PatentService());
  
  // Register project service
  container.register(ServiceTokens.ProjectService, async () => {
    const { projectService } = await import('@/lib/projectService');
    return projectService;
  });
  
  // Register CMS service
  container.register(ServiceTokens.CMSService, async () => {
    const { CMSService } = await import('@/lib/cmsService');
    return CMSService.getInstance();
  });
  
  // Register dashboard service
  container.register(ServiceTokens.DashboardService, async () => {
    const module = await import('@/lib/dashboardService');
    return module.DashboardService.getInstance();
  });
  
  // Register showcase service
  container.register(ServiceTokens.ShowcaseService, async () => {
    const module = await import('@/lib/showcaseService');
    return module;
  });
  
  // Register network service
  container.register(ServiceTokens.NetworkService, async () => {
    const module = await import('@/lib/networkService');
    return module;
  });
  
  // Register asset service
  container.register(ServiceTokens.AssetService, async () => {
    const { assetService } = await import('@/lib/assetService');
    return assetService;
  });
  
  // Register space service
  container.register(ServiceTokens.SpaceService, async () => {
    const module = await import('@/lib/spaceService');
    return module;
  });
  
  // Register AI service
  container.register(ServiceTokens.AIService, async () => {
    const { OpenRouterService } = await import('@/lib/openrouter');
    const apiKey = localStorage.getItem('openRouterApiKey') || '';
    return new OpenRouterService(apiKey);
  });
  
  // Register logger service
  container.register(ServiceTokens.LoggerService, () => ({
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
  }));
  
  // Register cache service
  container.register(ServiceTokens.CacheService, () => {
    const cache = new Map();
    return {
      get: (key: string) => cache.get(key),
      set: (key: string, value: any, ttl?: number) => {
        cache.set(key, value);
        if (ttl) {
          setTimeout(() => cache.delete(key), ttl);
        }
      },
      delete: (key: string) => cache.delete(key),
      clear: () => cache.clear(),
      has: (key: string) => cache.has(key)
    };
  });
  
  // Register event bus
  container.register(ServiceTokens.EventBus, () => {
    const listeners = new Map<string, Set<Function>>();
    return {
      on: (event: string, handler: Function) => {
        if (!listeners.has(event)) {
          listeners.set(event, new Set());
        }
        listeners.get(event)!.add(handler);
      },
      off: (event: string, handler: Function) => {
        listeners.get(event)?.delete(handler);
      },
      emit: (event: string, ...args: any[]) => {
        listeners.get(event)?.forEach(handler => handler(...args));
      },
      once: (event: string, handler: Function) => {
        const onceHandler = (...args: any[]) => {
          handler(...args);
          listeners.get(event)?.delete(onceHandler);
        };
        if (!listeners.has(event)) {
          listeners.set(event, new Set());
        }
        listeners.get(event)!.add(onceHandler);
      }
    };
  });
}