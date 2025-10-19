"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useAuth } from '@/app/contexts/AuthContext';
import { Terminal, ArrowLeft, Github } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithGitHub } = useAuth();
  const router = useRouter();

  const handleGitHubSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGitHub();
      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'GitHub sign-in failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Terminal className="h-8 w-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">is-a.software</span>
        </div>

        <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">
              Welcome to is-a.software
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sign in with GitHub to get your free subdomain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              type="button"
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 h-12 text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  Continue with GitHub
                </div>
              )}
            </Button>

            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Perfect for developers, side projects, and demos</p>
        </div>
      </div>
    </div>
  );
}