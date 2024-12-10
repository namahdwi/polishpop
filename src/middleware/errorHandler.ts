import { AxiosError } from 'axios';
import { captureError } from '../utils/errorTracking';
import { useToast } from '../components/ui/Toast';

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export class ApiErrorHandler {
  private static toast = useToast();

  static handle(error: Error | AxiosError): void {
    if (this.isAxiosError(error)) {
      this.handleAxiosError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  private static isAxiosError(error: any): error is AxiosError<ApiError> {
    return error.isAxiosError === true;
  }

  private static handleAxiosError(error: AxiosError<ApiError>): void {
    const statusCode = error.response?.status;
    const apiError = error.response?.data;

    switch (statusCode) {
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 404:
        this.handleNotFound();
        break;
      case 422:
        this.handleValidationError(apiError);
        break;
      case 429:
        this.handleRateLimitExceeded();
        break;
      default:
        this.handleGenericError(error);
    }

    // Log to error tracking service
    captureError(error, {
      context: 'API Error',
      statusCode,
      apiError,
    });
  }

  private static handleUnauthorized(): void {
    this.toast.toast({
      title: 'Session Expired',
      description: 'Please sign in again to continue.',
      variant: 'error',
    });
    // Redirect to login
    window.location.href = '/login';
  }

  private static handleForbidden(): void {
    this.toast.toast({
      title: 'Access Denied',
      description: 'You do not have permission to perform this action.',
      variant: 'error',
    });
  }

  private static handleNotFound(): void {
    this.toast.toast({
      title: 'Not Found',
      description: 'The requested resource was not found.',
      variant: 'error',
    });
  }

  private static handleValidationError(apiError?: ApiError): void {
    this.toast.toast({
      title: 'Validation Error',
      description: apiError?.message || 'Please check your input and try again.',
      variant: 'error',
    });
  }

  private static handleRateLimitExceeded(): void {
    this.toast.toast({
      title: 'Too Many Requests',
      description: 'Please wait a moment before trying again.',
      variant: 'warning',
    });
  }

  private static handleGenericError(error: Error): void {
    this.toast.toast({
      title: 'Error',
      description: 'An unexpected error occurred. Please try again later.',
      variant: 'error',
    });
    captureError(error, { context: 'Generic Error' });
  }
} 