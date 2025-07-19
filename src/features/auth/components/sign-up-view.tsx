'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type React from 'react';
import { redirect, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from '@/lib/axios';
import { useAuth } from '@/components/layout/providers';

interface SignUpViewPageProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export default function SignUpViewPage({
  isDark = false,
  onToggleTheme
}: SignUpViewPageProps) {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseId = user.uid;
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      await axios.post('/api/v1/users', { name, email, firebaseId });
      router.push("/dashboard/overview");

      // Redirect or show success as needed
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const name = user.displayName;
      const email = user.email;
      const firebaseId = user.uid;
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      await axios.post('/api/v1/users', { name, email, firebaseId });
      router.push("/dashboard/overview");
      // Redirect or show success as needed
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
        {/* Logo/Brand */}
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
            &ldquo;The onboarding process was seamless and the interface is
            incredibly user-friendly. Within minutes, I was able to set up my
            account and start exploring all the amazing features.&rdquo;
          </blockquote>

          <div className='flex items-center space-x-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500'>
              <span className='text-sm font-semibold text-white'>MJ</span>
            </div>
            <div>
              <div className='font-semibold text-white'>Michael Johnson</div>
              <div className='text-sm text-gray-400'>
                Product Manager at TechFlow Inc
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-sm text-gray-500'>
          © 2024 ShadcnUI. All rights reserved.
        </div>
      </div>

      {/* Right side - Sign Up Form */}
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
                Create account
              </h1>
              <p
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Join our community and unlock exclusive features tailored just
                for you.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignUp} className='space-y-4'>
              {/* Name Input */}
              <div className='space-y-2'>
                <label
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Name
                </label>
                <Input
                  type='text'
                  placeholder='Enter your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className={`${isDark ? 'border-gray-700 bg-black text-white placeholder-gray-500' : 'border-gray-300 bg-white'}`}
                />
              </div>

              {/* Email Input */}
              <div className='space-y-2'>
                <label
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className={`${isDark ? 'border-gray-700 bg-black text-white placeholder-gray-500' : 'border-gray-300 bg-white'}`}
                />
              </div>

              {/* Password Input */}
              <div className='space-y-2'>
                <label
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Password
                </label>
                <Input
                  type='password'
                  placeholder='Create a password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className={`${isDark ? 'border-gray-700 bg-black text-white placeholder-gray-500' : 'border-gray-300 bg-white'}`}
                />
              </div>

              {/* Confirm Password Input */}
              <div className='space-y-2'>
                <label
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Confirm Password
                </label>
                <Input
                  type='password'
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className={`${isDark ? 'border-gray-700 bg-black text-white placeholder-gray-500' : 'border-gray-300 bg-white'}`}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className='text-center text-sm text-red-500'>{error}</div>
              )}

              {/* Terms and Conditions */}
              <div
                className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                By creating an account, you agree to our{' '}
                <Link
                  href='/terms'
                  className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}
                >
                  Privacy Policy
                </Link>
                .
              </div>

              {/* Sign Up Button */}
              <Button
                type='submit'
                className='w-full bg-white text-black hover:bg-gray-100'
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>

              {/* Divider */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span
                    className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
                  />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span
                    className={`${isDark ? 'bg-gray-950 text-gray-400' : 'bg-white text-gray-500'} px-2`}
                  >
                    OR SIGN UP WITH
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className='grid grid-cols-3 gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className={`${isDark ? 'border-gray-700 bg-black text-white hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
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
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  disabled={loading}
                  className={`${isDark ? 'border-gray-700 bg-black text-white hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  disabled={loading}
                  className={`${isDark ? 'border-gray-700 bg-black text-white hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
                  </svg>
                </Button>
              </div>

              {/* Sign In Link */}
              <div
                className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Already have an account?{' '}
                <Link
                  href='/auth/sign-in'
                  className={`font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
