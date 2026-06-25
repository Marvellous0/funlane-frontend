import { ReactNode } from 'react';
import { AuthHero } from '../AuthHero';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="auth-wrap auth-geist">
      <div className="auth-split animate-scale-in">
        <AuthHero
          title={title}
          description={description}
        />

        <div className="auth-form-side overflow-y-auto">
          <div className="w-full max-w-sm mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}