'use client';
import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SignInViewPageProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export default function SignInViewPage({
  isDark = false,
  onToggleTheme
}: SignInViewPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      router.push('/dashboard/overview');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      router.push('/dashboard/overview');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Left side - Testimonial */}
      <div
        className={`hidden lg:flex lg:w-1/2 ${isDark ? 'bg-black' : 'bg-black'} flex-col justify-between p-12`}
      >
        <div className='flex items-center space-x-3'>
          <Image
            src={'/assets/sheetswaylogo.png'}
            alt='Sheetsway Logo'
            width={180}
            height={40}
            priority
            className='object-contain'
          />
        </div>

        {/* Testimonial */}
        <div className='space-y-6'>
          <blockquote className='text-lg leading-relaxed text-white'>
            &ldquo;Shadcn UI Kit for Figma has completely transformed our design
            process. It&apos;s incredibly intuitive and saves us so much time.
            The components are beautifully crafted and customizable.&rdquo;
          </blockquote>

          <div className='flex items-center space-x-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500'>
              <span className='text-sm font-semibold text-white'>ST</span>
            </div>
            <div>
              <div className='font-semibold text-white'>Sarah Thompson</div>
              <div className='text-sm text-gray-400'>
                Lead UX Designer at BrightWave Solutions
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-sm text-gray-500'>
          © 2024 ShadcnUI. All rights reserved.
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div
        className={`flex flex-1 flex-col ${isDark ? 'bg-gray-950' : 'bg-white'} relative`}
      >
        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <div className='absolute top-6 right-6'>
            <Button
              variant='ghost'
              size='icon'
              onClick={onToggleTheme}
              className={`${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              {isDark ? (
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
              ) : (
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                  />
                </svg>
              )}
            </Button>
          </div>
        )}

        {/* Form Container */}
        <div className='flex flex-1 items-center justify-center p-8'>
          <div className='w-full max-w-md space-y-6'>
            {/* Header */}
            <div className='space-y-2 text-center'>
              <h1
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Sign in
              </h1>
              <p
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Log in to unlock tailored content and stay connected with your
                community.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className='space-y-4'>
              {/* Email Input */}
              <div className='space-y-2'>
                <label
                  htmlFor='email'
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email or username'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:bg-white'
                    }`}
                />
              </div>

              {/* Password Input */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    Password
                  </label>
                  <Link
                    href='/forgot-password'
                    className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} underline`}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:bg-white'
                    }`}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className='text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800'>
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <Button
                type='submit'
                className="w-full bg-white text-black hover:bg-gray-100"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              {/* Divider */}
              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <span
                    className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
                  />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span
                    className={`${isDark ? 'bg-gray-950 text-gray-400' : 'bg-white text-gray-500'} px-2`}
                  >
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <Button
                type='button'
                variant='outline'
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full h-10 font-medium rounded-md transition-colors flex items-center justify-center gap-3 ${isDark
                  ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
                  : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <svg className='h-5 w-5' viewBox='0 0 24 24'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </Button>

              {/* Sign Up Link */}
              <div
                className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Don&apos;t have an account?{' '}
                <Link
                  href='/auth/sign-up'
                  className={`font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}