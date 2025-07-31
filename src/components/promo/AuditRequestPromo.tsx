'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileBadge2, CheckCircle2, ArrowUpRight, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

// A small component for the feature list items
const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
  <div className='flex items-center gap-3'>
    <CheckCircle2 size={20} className='flex-shrink-0 text-green-500' />
    <p className='text-gray-600'>{children}</p>
  </div>
);

// A component for the overlaying stat cards
const StatCard = ({
  label,
  value,
  className
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div
    className={`w-44 rounded-xl bg-indigo-900/95 p-4 text-center text-white shadow-lg backdrop-blur-sm ${className}`}
  >
    <p className='text-sm opacity-80'>{label}</p>
    <p className='text-4xl font-bold'>{value}</p>
  </div>
);

export const AuditRequestPromo = () => {
  const router = useRouter();
  return (
    <section className='py-8 not-dark:bg-white'>
      <div className='container mx-auto px-4'>
        {/* Main grid for two-column layout, stacks on mobile */}
        <div className='grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-8'>
          {/* --- Left Column: Textual Content --- */}
          <div className='animate-fade-in-left flex flex-col gap-6'>
            <div className='flex items-start gap-4'>
              <FileBadge2
                size={60}
                className='mt-1 flex-shrink-0 text-gray-800'
                strokeWidth={1.25}
              />
              <h1 className='text-4xl leading-tight font-bold text-gray-900 lg:text-5xl'>
                Create a New <br />
                Financial Audit Request
              </h1>
            </div>

            <p className='text-lg text-gray-600'>
              A full review of your company's financials by a licensed auditor.
              Required for many businesses in Malta and the EU.
            </p>

            <div className='h-0.5 w-20 bg-gray-200' />

            <div>
              <h2 className='text-xl font-bold text-gray-800'>
                Financial Audit
              </h2>
              <p className='text-sm text-gray-500'>(GAPSME / IFRS)</p>
            </div>

            <div className='flex flex-col gap-4'>
              <FeatureListItem>
                For{' '}
                <span className='font-semibold text-gray-700'>compliance</span>,
                funding, or group reporting
              </FeatureListItem>
              <FeatureListItem>
                <span className='font-semibold text-gray-700'>Includes</span>{' '}
                Official audit report, fully online
              </FeatureListItem>
            </div>

            <div className='flex items-center gap-4 pt-4'>
              <Button
                onClick={() => router.push('/dashboard/request')}
                size='lg'
                className='rounded-lg bg-orange-500 px-8 py-6 text-base font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600'
              >
                Start Now
              </Button>
              <div className='mr-3 rounded-md bg-indigo-900 p-3 text-white'>
                <ArrowUpRight
                  size={20}
                  onClick={() => router.push('/dashboard/request')}
                />
              </div>
              <Button
                variant='ghost'
                className='font-bold text-gray-800 hover:bg-transparent'
              >
                Learn more
              </Button>
            </div>
          </div>

          {/* --- Right Column: Image Collage and Stats --- */}
          {/* This container needs a defined height on mobile to contain the absolute elements */}
          <div className='animate-fade-in-right relative h-[650px] lg:h-[600px]'>
            {/* Image of the woman */}
            <img
              src='https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              alt='Professional auditor'
              className='absolute top-0 right-0 h-3/5 w-4/5 rounded-2xl object-cover shadow-xl'
            />
            {/* Image of the team */}
            <img
              src='https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              alt='Team collaborating in an office'
              className='absolute bottom-0 left-0 h-2/5 w-full rounded-2xl object-cover shadow-xl'
            />

            {/* Top Orange Info Box */}
            <div className='absolute top-1/4 left-0 w-64 -translate-x-1/4 rounded-2xl bg-orange-400 p-6 text-white shadow-lg'>
              <div className='mb-2 flex items-center -space-x-4'>
                <img
                  src='https://randomuser.me/api/portraits/men/32.jpg'
                  alt='User 1'
                  className='h-12 w-12 rounded-full border-2 border-white'
                />
                <img
                  src='https://randomuser.me/api/portraits/men/34.jpg'
                  alt='User 2'
                  className='h-12 w-12 rounded-full border-2 border-white'
                />
                <img
                  src='https://randomuser.me/api/portraits/women/33.jpg'
                  alt='User 3'
                  className='h-12 w-12 rounded-full border-2 border-white'
                />
              </div>
              <p className='text-4xl font-bold'>2,000+</p>
              <p className='opacity-90'>
                More than 2,000 people have joined us
              </p>
            </div>

            {/* Bottom Orange Info Box */}
            <div className='absolute bottom-1/4 left-1/4 rounded-2xl bg-orange-400 p-6 text-white shadow-lg'>
              <p className='text-4xl font-bold'>Over 15K</p>
              <p className='text-sm tracking-wider opacity-90'>
                COMPLETE AUDITS
              </p>
            </div>

            {/* Circular "View Video" Button with animated text */}
            <div className='absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2'>
              <Button
                variant='ghost'
                className='relative flex h-36 w-36 items-center justify-center rounded-full bg-indigo-900 text-white shadow-2xl transition-transform hover:scale-105 hover:bg-indigo-800'
              >
                <Play size={28} className='fill-white' />
                {/* Animated rotating text */}
                <div className='animate-spin-slow absolute inset-0'>
                  <p className='text-xs font-semibold tracking-widest uppercase'>
                    {`• View our video • Learn more `
                      .split('')
                      .map((char, i) => (
                        <span
                          key={i}
                          className='absolute left-1/2 h-full origin-bottom'
                          style={{
                            transform: `translateX(-50%) rotate(${i * 12.5}deg)`
                          }}
                        >
                          <span
                            style={{ transform: `translateY(-4.5rem)` }}
                            className='inline-block'
                          >
                            {char}
                          </span>
                        </span>
                      ))}
                  </p>
                </div>
              </Button>
            </div>

            {/* Absolute positioned stat cards on the right */}
            <div className='absolute top-[55%] right-0 -translate-y-1/2 space-y-4'>
              <StatCard label='Satisfaction Rate' value='98%' />
              <StatCard label='Successful Audits' value='15k+' />
              <StatCard label='Clients Served' value='8,4k' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// You might need to add this animation to your tailwind.config.js
/*
module.exports = {
  // ...
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
      },
      keyframes: {
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      }
    },
  },
  // ...
};
*/
