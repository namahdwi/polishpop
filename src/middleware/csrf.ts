import { generateToken, verifyToken } from '../utils/crypto';
import { useEffect, ComponentType, JSX } from 'react';
import axios from 'axios';
import React from 'react';

declare global {
  interface Window {
    axios?: typeof axios;
  }
}

export class CSRFProtection {
  private static instance: CSRFProtection;
  private tokenSecret: string;
  private cookieName: string = 'XSRF-TOKEN';
  public readonly headerName: string = 'X-XSRF-TOKEN';

  private constructor() {
    this.tokenSecret = import.meta.env.VITE_ENCRYPTION_KEY;
  }

  static getInstance(): CSRFProtection {
    if (!this.instance) {
      this.instance = new CSRFProtection();
    }
    return this.instance;
  }

  generateToken(): string {
    const token = generateToken(this.tokenSecret);
    // Set token in cookie with appropriate flags
    document.cookie = `${this.cookieName}=${token}; path=/; SameSite=Strict; Secure`;
    return token;
  }

  verifyToken(token: string): boolean {
    const cookieToken = this.getTokenFromCookie();
    return token === cookieToken && verifyToken(token, this.tokenSecret);
  }

  private getTokenFromCookie(): string | null {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(this.cookieName))
      ?.split('=')[1] || null;
  }
}

interface WithCSRFProps {
  onError?: (error: Error) => void;
}

export function withCSRFProtection<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithCSRFProps> {
  function WithCSRFComponent(props: P & WithCSRFProps): JSX.Element {
    const csrfProtection = CSRFProtection.getInstance();

    useEffect(() => {
      try {
        const token = csrfProtection.generateToken();
        // Add token to all subsequent axios/fetch requests
        if (window.axios) {
          window.axios.defaults.headers.common[csrfProtection.headerName] = token;
        }
      } catch (error) {
        props.onError?.(error as Error);
      }
    }, [props.onError]);

    return React.createElement(WrappedComponent, props);
  }

  WithCSRFComponent.displayName = `WithCSRF(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithCSRFComponent;
}   