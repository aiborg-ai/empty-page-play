export const ServiceTokens = {
  AuthService: Symbol('AuthService'),
  ProjectService: Symbol('ProjectService'),
  PatentService: Symbol('PatentService'),
  CMSService: Symbol('CMSService'),
  DashboardService: Symbol('DashboardService'),
  NetworkService: Symbol('NetworkService'),
  AssetService: Symbol('AssetService'),
  ShowcaseService: Symbol('ShowcaseService'),
  AIService: Symbol('AIService'),
  NotificationService: Symbol('NotificationService'),
  AnalyticsService: Symbol('AnalyticsService'),
  SearchService: Symbol('SearchService'),
  CollaborationService: Symbol('CollaborationService'),
  PaymentService: Symbol('PaymentService'),
  ReportService: Symbol('ReportService'),
  SpaceService: Symbol('SpaceService'),
  UserService: Symbol('UserService'),
  ConfigService: Symbol('ConfigService'),
  LoggerService: Symbol('LoggerService'),
  CacheService: Symbol('CacheService'),
  HttpClient: Symbol('HttpClient'),
  EventBus: Symbol('EventBus'),
  SupabaseClient: Symbol('SupabaseClient')
} as const;

export type ServiceToken = typeof ServiceTokens[keyof typeof ServiceTokens];