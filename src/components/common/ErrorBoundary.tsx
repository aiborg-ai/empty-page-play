/**
 * Error Boundary for SearchFilterBar and related components
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { SearchFilterError } from '../../types/searchFilter';
import { AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: SearchFilterError) => void;
  showDetails?: boolean;
}

class SearchFilterErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate unique error ID for tracking
    const errorId = `sf_error_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Report error to monitoring service
    const searchFilterError: SearchFilterError = {
      type: this.categorizeError(error),
      message: error.message,
      code: this.state.errorId,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('SearchFilterBar Error:', error, errorInfo);
    }

    // Report to external error handler
    this.props.onError?.(searchFilterError);

    // In production, you might want to send to error tracking service
    // e.g., Sentry, LogRocket, etc.
    this.reportToMonitoring(searchFilterError, errorInfo);
  }

  private categorizeError(error: Error): SearchFilterError['type'] {
    if (error.name === 'TypeError') return 'validation';
    if (error.message.includes('fetch') || error.message.includes('network')) return 'network';
    if (error.message.includes('JSON') || error.message.includes('parse')) return 'parsing';
    return 'unknown';
  }

  private reportToMonitoring(error: SearchFilterError, errorInfo: ErrorInfo) {
    // In a real application, send to monitoring service
    if (typeof window !== 'undefined' && window.console) {
      console.warn('Error reported to monitoring:', {
        error,
        errorInfo,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Something went wrong with the search filters
              </h3>
              <p className="text-red-700 mb-4">
                We're sorry, but the search and filter system encountered an error. 
                You can try refreshing or continue using the basic features.
              </p>
              
              {this.props.showDetails && this.state.error && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                    Show technical details
                  </summary>
                  <div className="mt-2 p-3 bg-red-100 rounded text-sm font-mono text-red-800">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div className="mb-2">
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reload Page
                </button>
                
                <a
                  href="/support"
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Get Help
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SearchFilterErrorBoundary;