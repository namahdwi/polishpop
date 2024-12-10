
export interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// If you're using custom claims in Firebase Auth, you might want to add:
declare module 'firebase/auth' {
  interface User {
    isAdmin?: boolean;
  }
} 