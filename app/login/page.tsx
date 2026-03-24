import { LoginForm } from '@/components/login-form';
import Image from 'next/image';

export const metadata = {
  title: 'Login - OpsDash',
  description: 'Login to OpsDash Operations Dashboard',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full flex flex-col items-center justify-center max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image 
              src="/logo.jpg" 
              alt="OpsDash Logo" 
              width={80} 
              height={80}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">OpsDash</h1>
          <p className="text-sm text-muted-foreground">Operations Monitoring Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
