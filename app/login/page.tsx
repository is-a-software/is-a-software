"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Footer } from '@/app/components/Footer';
import { Navbar } from '@/app/components/Navbar';
import { useAuth } from '@/app/contexts/AuthContext';
import { ArrowLeft, Github } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const { signInWithGitHub } = useAuth();
  const router = useRouter();

  const handleGitHubSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGitHub();
      // Redirect to dashboard after successful popup sign-in
      router.push('/dashboard');
    } catch (e: unknown) {
      // Map firebase 'user-disabled' error to a friendly message with mailto link
      const err = e as { code?: string; message?: string } | Error;
      const errObj = err as { code?: string; message?: string };
      if (errObj.code === 'auth/user-disabled' || (typeof errObj.message === 'string' && errObj.message.includes('auth/user-disabled'))) {
        setError(
          <span>
            Your account has been suspended. If you believe this is a mistake email us at{' '}
            <a href="mailto:admin@is-a.software" className="text-white underline">admin@is-a.software</a>
          </span>
        );
      } else {
        const message = e instanceof Error ? e.message : 'GitHub sign-in failed';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] flex flex-col">
      <Navbar currentPage="login" />
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Back to home link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8 text-sm sm:text-base"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <span className="text-xl sm:text-2xl font-bold text-white">is-a.software</span>
          </div>

          <Card className="bg-gradient-to-br from-[#0C0C0C] via-[#0a0a0a] to-black border-[#333333] shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-white text-lg sm:text-xl">
                Welcome to is-a.software
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm sm:text-base">
                Sign in with GitHub to get your free subdomain
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              {error && (
                <div className="mb-4 text-red-400 text-xs sm:text-sm text-center">
                  {error}
                </div>
              )}

              <Button 
                type="button"
                onClick={handleGitHubSignIn}
                disabled={loading}
                className="w-full bg-gradient-to-r from-black to-[#1a1a1a] hover:from-[#0a0a0a] hover:to-[#2a2a2a] text-white border border-[#333333] h-10 sm:h-12 text-sm sm:text-lg shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                    <span className="text-xs sm:text-base">Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-base">Continue with GitHub</span>
                  </div>
                )}
              </Button>

              <div className="mt-4 sm:mt-6 text-center text-gray-400 text-xs sm:text-sm">
                <p className="leading-relaxed">
                  By signing in, you agree to our{' '}
                  <Link href="/terms" className="text-white hover:text-gray-300 underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-white hover:text-gray-300 underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>Perfect for developers, side projects, and demos</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}