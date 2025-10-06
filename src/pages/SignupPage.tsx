import { SignupForm } from '@/components/signup-form';

export function SignupPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <SignupForm />
      </div>
    </div>
  );
}