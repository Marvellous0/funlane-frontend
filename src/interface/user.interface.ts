export type Role = 'client' | 'agent' | 'admin';

export type ClientType = 'Corporate' | 'Retail';

export interface Client {
  id: string;
  name: string;
  email: string;
  type: ClientType;
  wallet: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
}

/** The principal stored in the auth store / cookie after a successful login. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Credentials {
  email: string;
  password: string;
  role: Role;
}
