
import { LoginForm } from '@/components/login-form';

export function LoginPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}