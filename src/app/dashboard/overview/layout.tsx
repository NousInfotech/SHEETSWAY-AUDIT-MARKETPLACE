// 'use client';

// import PageContainer from '@/components/layout/page-container';
// import { useAuth } from '@/components/layout/providers';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardAction,
//   CardFooter
// } from '@/components/ui/card';
// import { auth } from '@/lib/firebase';
// import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
// import Link from 'next/link';
// import React from 'react';

// export default function OverViewLayout({
//   sales,
//   pie_stats,
//   bar_stats,
//   area_stats
// }: {
//   sales: React.ReactNode;
//   pie_stats: React.ReactNode;
//   bar_stats: React.ReactNode;
//   area_stats: React.ReactNode;
// }) {
//   const buttons = [
//     {
//       name: 'Create Audit/Tax Request',
//       link: '/dashboard/request'
//     },
//     {
//       name: 'UploadFiles',
//       link: '/'
//     },
//     {
//       name: 'Last Created Job',
//       link: '/dashboard/history'
//     },
//     {
//       name: 'Schedule Meeting',
//       link: '/dashboard/connect'
//     },
//     {
//       name: 'Contact&Support',
//       link: '/dashboard/connect'
//     }
//   ];

//   const { appUser, firebaseUser } = useAuth();

//   return (
//     <PageContainer>
//       <div className='flex flex-1 flex-col space-y-2'>
//         <div className='flex items-center justify-between space-y-2'>
//           <h2 className='text-2xl font-bold tracking-tight'>
//             Hi, Welcome Back {firebaseUser?.displayName || appUser?.name || ""} 👋
//           </h2>
//         </div>

//         {/* Cards Section */}
//         <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
//           <Card className='@container/card'>
//             <CardHeader>
//               <CardDescription>Active Engagements</CardDescription>
//               <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
//                 10
//               </CardTitle>
//               <CardAction>
//                 <Badge variant='outline'>
//                   <IconTrendingUp />
//                   status
//                 </Badge>
//               </CardAction>
//             </CardHeader>
//             <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//               <div className='line-clamp-1 flex gap-2 font-medium'>
//                 View Details <IconTrendingUp className='size-4' />
//               </div>
//               <div className='text-muted-foreground'>
//                 see all the active engagements
//               </div>
//             </CardFooter>
//           </Card>

//           <Card className='@container/card'>
//             <CardHeader>
//               <CardDescription>Open Proposals</CardDescription>
//               <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
//                 70
//               </CardTitle>
//               <CardAction>
//                 <Badge variant='outline'>
//                   <IconTrendingDown />
//                   status
//                 </Badge>
//               </CardAction>
//             </CardHeader>
//             <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//               <div className='line-clamp-1 flex gap-2 font-medium'>
//                 View Details <IconTrendingDown className='size-4' />
//               </div>
//               <div className='text-muted-foreground'>
//                 See All the proposals available
//               </div>
//             </CardFooter>
//           </Card>

//           <Card className='@container/card'>
//             <CardHeader>
//               <CardDescription>Schedule Meeting</CardDescription>
//               <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
//                 📅
//               </CardTitle>
//               <CardAction>
//                 <Badge variant='outline'>
//                   <IconTrendingUp />
//                   schedule
//                 </Badge>
//               </CardAction>
//             </CardHeader>
//             <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//               <div className='line-clamp-1 flex gap-2 font-medium'>
//                 Today’s Meeting <IconTrendingUp className='size-4' />
//               </div>
//               <div className='text-muted-foreground'>
//                 See All the Meeting Available
//               </div>
//             </CardFooter>
//           </Card>

//           <Card className='@container/card'>
//             <CardHeader>
//               <CardDescription>Pending Payments</CardDescription>
//               <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
//                 100
//               </CardTitle>
//               <CardAction>
//                 <Badge variant='outline'>
//                   <IconTrendingUp />
//                   status
//                 </Badge>
//               </CardAction>
//             </CardHeader>
//             <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//               <div className='line-clamp-1 flex gap-2 font-medium'>
//                 View Details
//                 <IconTrendingUp className='size-4' />
//               </div>
//               <div className='text-muted-foreground'>
//                 See All the pending payments
//               </div>
//             </CardFooter>
//           </Card>
//         </div>

//         {/* QUICK ACTIONS Section */}
//         <div className='my-10'>
//           <h3 className='font-semibold text-lg mb-3'>QUICK ACTIONS</h3>
//           <div className='my-5 flex w-full flex-col items-center justify-center gap-6 px-5 md:flex-row md:justify-around md:overflow-x-auto md:px-0 md:whitespace-nowrap'>
//             {buttons.map((btn, index) => (
//               <Button
//                 key={index}
//                 asChild
//                 variant='secondary'
//                 className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'
//               >
//                 <Link href={btn.link}>{btn.name}</Link>
//               </Button>
//             ))}
//           </div>
//         </div>

//         {/* CHARTS Section */}
//         <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
//           <div className='col-span-4'>{bar_stats}</div>
//           <div className='col-span-4 md:col-span-3'>{sales}</div>
//           <div className='col-span-4'>{area_stats}</div>
//           <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
//         </div>
//       </div>
//     </PageContainer>
//   );
// }

// ########################################################################################################

'use client';

import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/components/layout/providers';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Layers,
  Upload,
  CalendarPlus,
  Users,
  AlertCircle,
  Mail,
  RefreshCw,
  PlusSquare,
  ChevronDown,
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// --- Helper Components for Clean Code ---

// Progress Stepper Component - Rebuilt to match the image exactly
const ProgressStepper = () => {
  const steps = [
    { name: 'Documents Collected', completed: true },
    { name: 'Fieldwork In Progress', completed: true },
    { name: 'Under Review', completed: true },
    { name: 'Report Finalized', completed: false },
    { name: 'Audit Completed', completed: false }
  ];
  const completedSteps = steps.filter((step) => step.completed).length;
  // Calculate width for the progress line. (e.g., 3 completed steps means the line should reach the 3rd dot)
  // which is 2 out of 4 segments.
  const progressPercentage =
    completedSteps > 1 ? ((completedSteps - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className='w-full px-4 pt-8'>
      <div className='relative flex items-start justify-between'>
        {/* The background connecting line */}
        <div className='absolute top-1.5 left-0 h-0.5 w-full bg-gray-200'></div>
        {/* The foreground progress line */}
        <div
          className='absolute top-1.5 left-0 h-0.5 bg-blue-500'
          style={{ width: `${progressPercentage}%` }}
        ></div>

        {steps.map((step) => (
          <div
            key={step.name}
            className='z-10 flex w-1/5 flex-col items-center'
          >
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full not-dark:bg-white ${
                step.completed
                  ? 'border-2 border-blue-500'
                  : 'border-2 border-gray-300'
              }`}
            >
              {step.completed && (
                <div className='h-2 w-2 rounded-full bg-blue-500'></div>
              )}
            </div>
            <p className='mt-2 text-center text-xs font-medium whitespace-nowrap text-gray-500'>
              {step.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { firebaseUser } = useAuth();

  const quickActions = [
    {
      name: 'Create Audit / Tax Request',
      icon: <Layers size={28} className='text-gray-600' />
    },
    {
      name: 'Upload Files',
      icon: <Upload size={28} className='text-gray-600' />
    },
    {
      name: 'Schedule Meeting',
      icon: <CalendarPlus size={28} className='text-gray-600' />
    },
    {
      name: 'Contact & Support',
      icon: <Users size={28} className='text-gray-600' />
    }
  ];

  const pendingActions = [
    { text: 'Upload your signed engagement letter to begin the audit.' },
    { text: 'Complete your company details form.' },
    { text: 'Upload missing bank statements for April-June.' }
  ];

  const mailItems = [
    {
      auditor: 'Auditor Name',
      engagement: 'Engagement Name',
      time: '08/07/25 - 14:47pm'
    },
    {
      auditor: 'Auditor Name',
      engagement: 'Engagement Name',
      time: '08/07/25 - 14:47pm'
    },
    {
      auditor: 'Auditor Name',
      engagement: 'Engagement Name',
      time: '08/07/25 - 14:47pm'
    }
  ];

  const updates = [
    {
      text: 'Your audit report is being finalized.',
      time: '08/07/25 - 14:47pm'
    },
    {
      text: 'Auditor completed fieldwork – review summary.',
      time: '08/07/25 - 14:47pm'
    },
    {
      text: 'Proposal deadline extended by 3 days.',
      time: '08/07/25 - 14:47pm'
    },
    {
      text: 'New invoice generated for current engagement.',
      time: '08/07/25 - 14:47pm'
    },
    {
      text: 'Your document upload was successfully verified.',
      time: '08/07/25 - 14:47pm'
    }
  ];

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6 rounded-lg p-4 not-dark:bg-gray-50/75'>
        {/* === Header === */}
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Hi, Welcome Back 👋
          </h2>
        </div>

        {/* === Main Grid Layout === */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* --- Left Column --- */}
          <div className='flex flex-col justify-between gap-6 lg:col-span-2'>
            {/* Top Stat Cards */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Card className='shadow-sm not-dark:bg-white'>
                <CardHeader>
                  <CardDescription>Active Engagements</CardDescription>
                  <CardTitle className='text-4xl font-bold'>10</CardTitle>
                  <div className='mt-2 flex cursor-pointer items-center text-sm font-semibold text-blue-600'>
                    View Details
                    <ChevronDown className='ml-1' size={16} />
                  </div>
                  <p className='text-xs text-gray-500'>
                    see all the active engagements
                  </p>
                </CardHeader>
              </Card>
              <Card className='shadow-sm not-dark:bg-white'>
                <CardHeader>
                  <CardDescription>Open Proposals</CardDescription>
                  <CardTitle className='text-4xl font-bold'>70</CardTitle>
                  <div className='mt-2 flex cursor-pointer items-center text-sm font-semibold text-blue-600'>
                    View Details
                    <ChevronDown className='ml-1' size={16} />
                  </div>
                  <p className='text-xs text-gray-500'>
                    see all the proposals available
                  </p>
                </CardHeader>
              </Card>
            </div>

            {/* Progress Card */}
            <Card className='border-t-8 border-t-amber-400 shadow-sm not-dark:bg-white'>
              <CardHeader>
                <div className='flex flex-wrap items-start justify-between gap-y-2'>
                  <div className='flex-grow'>
                    <p className='flex items-center text-lg font-bold'>
                      <BarChart3 size={20} className='mr-2 text-amber-500' />
                      Progress:{' '}
                      <span className='ml-1 font-normal'>
                        Report is ready for your confirmation
                      </span>
                    </p>
                    <div className='mt-2'>
                      <Button
                        variant='outline'
                        className='h-8 rounded-lg text-gray-700'
                      >
                        Engagement Name{' '}
                        <ChevronDown size={16} className='ml-2' />
                      </Button>
                    </div>
                  </div>
                  <div className='flex-shrink-0 text-right'>
                    <p className='text-sm'>
                      deadline:{' '}
                      <span className='font-semibold text-gray-800'>
                        3rd July 2025 - 22 days
                      </span>
                    </p>
                    <Button className='mt-1 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700'>
                      Extend
                    </Button>
                  </div>
                </div>
                <div className='mt-4 text-sm font-semibold'>
                  Status:{' '}
                  <span className='text-amber-500'>
                    Pending Client Response
                  </span>
                </div>
                <ProgressStepper />
              </CardHeader>
            </Card>

            {/* Quick Actions */}
            <div className='rounded-lg border border-t-8 border-t-blue-500 p-4 shadow-sm not-dark:bg-white'>
              <h3 className='flex items-center text-xl font-bold text-gray-700'>
                {' '}
                <span className='mr-2 text-2xl font-black text-blue-500'>
                  »
                </span>{' '}
                Quick Actions
              </h3>
              <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
                {quickActions.map((action) => (
                  <div
                    key={action.name}
                    className='flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center transition-all not-dark:bg-white hover:border-gray-300 hover:shadow-md'
                  >
                    {action.icon}
                    <p className='mt-2 text-xs font-semibold text-gray-700'>
                      {action.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* === Your Requests Card - CORRECTED LAYOUT === */}

            <div className='flex items-center justify-between'>
              <Card className='mx-2 h-full w-3/4 border-t-8 border-t-green-500 shadow-sm not-dark:bg-white'>
                <div className='flex h-full w-full flex-col justify-around'>
                  <CardHeader>
                    <CardTitle className='flex items-center text-lg'>
                      <PlusSquare size={20} className='mr-2 text-green-600' />{' '}
                      Your Requests
                    </CardTitle>
                  </CardHeader>

                  <div className='flex w-full items-center gap-2 px-4'>
                    <Card className='h-full w-full rounded-xl p-4 shadow not-dark:bg-white'>
                      <div className='flex items-center justify-between'>
                        <CardDescription>Total Requests</CardDescription>
                        <Upload size={16} className='text-gray-400' />
                      </div>
                      <CardTitle className='text-4xl font-bold'>5</CardTitle>
                      <p className='text-xs text-gray-500'>
                        3 open, 1 in progress
                      </p>
                    </Card>

                    <Card className='h-full w-full rounded-xl p-4 shadow not-dark:bg-white'>
                      <div className='flex items-center justify-between'>
                        <CardDescription>Total Proposals</CardDescription>
                        <Users size={16} className='text-gray-400' />
                      </div>
                      <CardTitle className='text-4xl font-bold'>5</CardTitle>
                      <p className='text-xs text-gray-500'>
                        2 pending, 2 accepted
                      </p>
                    </Card>
                  </div>
                </div>
              </Card>

              {/* Calendar now correctly aligned in the third column */}
              <div className='rounded-md border border-t-8 border-t-green-800 md:col-span-1'>
                <Card className='border-0 p-3 shadow-sm not-dark:bg-white'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    className='rounded-md border shadow-sm'
                    captionLayout='dropdown'
                  />
                </Card>
              </div>
            </div>
          </div>

          {/* --- Right Column --- */}
          <div className='flex flex-col gap-6 lg:col-span-1'>
            {/* Actions Pending */}
            <Card className='border-t-8 border-t-amber-400 shadow-sm not-dark:bg-white'>
              <CardHeader>
                <CardTitle className='flex items-center text-lg'>
                  <AlertCircle size={20} className='mr-2 text-amber-500' />{' '}
                  Actions Pending
                </CardTitle>
                <div className='mt-4 space-y-3'>
                  {pendingActions.map((action, i) => (
                    <div
                      key={i}
                      className='flex items-center justify-between text-sm'
                    >
                      <p className='pr-2 text-gray-600'>{action.text}</p>
                      <Button className='h-6 flex-shrink-0 rounded-full bg-amber-100 px-3 text-xs font-semibold text-amber-600 hover:bg-amber-200'>
                        go to
                      </Button>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Upcoming Meeting */}
            <Card className='border-t-8 border-t-red-500 shadow-sm not-dark:bg-white'>
              <CardHeader>
                <CardTitle className='flex items-center text-lg'>
                  <span className='mr-2 text-xl text-red-500'>📅</span> Upcoming
                  Meeting
                  <ArrowRight className='ml-auto text-gray-400' size={16} />
                </CardTitle>
                <div className='mt-2 flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-semibold text-gray-500'>
                      See all the upcoming meetings 🟠
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-orange-500'>
                      25th June 2025
                    </p>
                    <p className='text-sm text-gray-600'>10:30am (GMT+1)</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Mail Card */}
            <Card className='border-t-8 border-t-blue-500 shadow-sm not-dark:bg-white'>
              <CardHeader>
                <CardTitle className='flex items-center text-lg'>
                  <Mail size={20} className='mr-2 text-blue-500' /> Mail
                </CardTitle>
                <div className='mt-4 space-y-3'>
                  {mailItems.map((item, i) => (
                    <div
                      key={i}
                      className='flex items-center justify-between gap-2 text-sm'
                    >
                      <div>
                        <p className='font-semibold'>{item.auditor}</p>
                        <p className='text-xs text-gray-500'>New Messages 🟠</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold'>{item.engagement}</p>
                        <p className='text-xs text-gray-500'>
                          latest: {item.time}
                        </p>
                      </div>
                      <Button
                        variant='outline'
                        className='h-7 flex-shrink-0 rounded-full border-blue-600 px-4 font-semibold text-blue-600 hover:bg-blue-50'
                      >
                        open
                      </Button>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Updates Card */}
            <Card className='border-t-8 border-t-green-600 shadow-sm not-dark:bg-white'>
              <CardHeader>
                <CardTitle className='flex items-center text-lg'>
                  <RefreshCw size={20} className='mr-2 text-green-600' />{' '}
                  Updates
                </CardTitle>
                <ul className='mt-4 list-inside list-disc space-y-2.5 text-sm text-gray-700'>
                  {updates.map((update, i) => (
                    <li key={i} className='flex justify-between'>
                      <span>{update.text}</span>
                      <span className='flex-shrink-0 pl-2 text-xs whitespace-nowrap text-gray-400'>
                        {update.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* --- CHARTS Section (Unchanged as requested) --- */}
        <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
