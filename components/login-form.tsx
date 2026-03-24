'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionConflictModal } from '@/components/session-conflict-modal';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSessionConflict, setShowSessionConflict] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific status errors
        if (data.error?.includes('pending')) {
          router.push('/pending');
          router.refresh();
          return;
        }
        if (data.error?.includes('rejected')) {
          router.push('/denied');
          router.refresh();
          return;
        }
        setError(data.error || 'Login failed');
        return;
      }

      // Show session conflict alert if another session was superseded
      if (data.hasOtherSession) {
        setShowSessionConflict(true);
        setTimeout(() => {
          // Redirect after showing alert
          if (data.user?.status === 'pending') {
            router.push('/pending');
          } else if (data.user?.status === 'rejected') {
            router.push('/denied');
          } else if (data.user?.status === 'approved') {
            if (data.user?.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/');
            }
          }
          router.refresh();
        }, 2000);
        return;
      }

      // Redirect based on user status
      if (data.user?.status === 'pending') {
        router.push('/pending');
      } else if (data.user?.status === 'rejected') {
        router.push('/denied');
      } else if (data.user?.status === 'approved') {
        if (data.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('[v0] Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      <SessionConflictModal isOpen={showSessionConflict} onClose={() => setShowSessionConflict(false)} />
    </>
  );
}
