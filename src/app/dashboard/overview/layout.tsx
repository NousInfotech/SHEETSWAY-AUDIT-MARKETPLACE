'use client';

import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/components/layout/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const buttons = [
    {
      name: 'Create Audit/Tax Request',
      link: '/dashboard/request'
    },
    {
      name: 'UploadFiles',
      link: '/'
    },
    {
      name: 'Last Created Job',
      link: '/dashboard/history'
    },
    {
      name: 'Schedule Meeting',
      link: '/dashboard/connect'
    },
    {
      name: 'Contact&Support',
      link: '/dashboard/connect'
    }
  ];

  const { appUser,firebaseUser } = useAuth();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome Back {firebaseUser?.displayName || appUser.name} 👋
          </h2>
        </div>

        {/* Cards Section */}
        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Active Engagements</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                10
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  status
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                View Details <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                see all the active engagements
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Open Proposals</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                70
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingDown />
                  status
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                View Details <IconTrendingDown className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                See All the proposals available
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Schedule Meeting</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                📅
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  schedule
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Today’s Meeting <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                See All the Meeting Available
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Pending Payments</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                100
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  status
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                View Details
                <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                See All the pending payments
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* QUICK ACTIONS Section */}
        <div className='my-10'>
          <h3 className='font-semibold text-lg mb-3'>QUICK ACTIONS</h3>
          <div className='my-5 flex w-full flex-col items-center justify-center gap-6 px-5 md:flex-row md:justify-around md:overflow-x-auto md:px-0 md:whitespace-nowrap'>
            {buttons.map((btn, index) => (
              <Button
                key={index}
                asChild
                variant='secondary'
                className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'
              >
                <Link href={btn.link}>{btn.name}</Link>
              </Button>
            ))}
          </div>
        </div>

        {/* CHARTS Section */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
