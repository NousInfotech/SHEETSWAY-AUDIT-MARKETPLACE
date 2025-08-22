// 'use client';
// import React, { useEffect, useState } from 'react';
// import { getAuditorById } from '@/api/auditor.api';
// import { ChatThread } from '@/features/chat/components/ChatThread';

// export default function ChatOnlyView({ engagement }: any) {
//   const [auditor, setAuditor] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (engagement?.proposal?.auditorId) {
//       const findAuditor = async () => {
//         try {
//           const currentAuditor = await getAuditorById(
//             engagement.proposal.auditorId
//           );
//           setAuditor(currentAuditor);
//         } catch (error) {
//           console.error('Failed to fetch auditor:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       findAuditor();
//     } else {
//       setIsLoading(false);
//       console.warn(
//         'Engagement is missing an auditorId. Chat cannot be loaded.'
//       );
//     }
//   }, [engagement]);

//   // --- Show a loading state until all data is ready ---
//   if (isLoading || !engagement || !auditor) {
//     return <p>Loading Chat...</p>; // Or a spinner component
//   }

//   // --- CORRECTED LOGIC ---
//   // 1. Assign threadId directly from engagement.id
//   const threadId = engagement.id;

//   // 2. The currentUser is the full auditor object we fetched
//   const currentUser = auditor;

//   return (
//     <main>
//       <ChatThread threadId={threadId} currentUser={currentUser} />
//     </main>
//   );
// }

// ###################################################################################################################

'use client';
import React from 'react';
import { useAuth } from '@/components/layout/providers';
import { ChatThread } from '@/features/chat/components/ChatThread';
import { User } from '@/features/chat/lib/types';

// This component now has a single, clear responsibility:
// display the chat for the currently logged-in client user.
export default function ChatOnlyView({ engagement }: any) {
  // 1. Get the authenticated client user from the auth context.
  const { appUser, loading: authLoading } = useAuth();

  // Show a loading state while the user session is being verified.
  if (authLoading) {
    return (
      <p className='text-muted-foreground p-4 text-center'>
        Authenticating User...
      </p>
    );
  }

  // --- 2. VALIDATE ALL NECESSARY DATA ---
  // We need a logged-in user (the client) and a valid chat thread ID from the engagement.
  if (appUser && engagement?.chatThread?.id) {
    // --- 3. THE CURRENT USER IS THE CLIENT USER ---
    // Normalize the user object from the auth hook to match the chat's expected `User` type.
    const currentUser: User = {
      id: appUser.id, // Or appUser.uid, depending on your auth object
      name: appUser.name // Or appUser.displayName
    };

    const receiver = {
      name: engagement.auditor?.name || 'Provider'
    };

    return (
      <main>
        <ChatThread
          // The thread ID comes from the nested engagement data
          threadId={engagement.chatThread.id}
          // The current user is the logged-in client
          currentUser={currentUser}
          receiverName={receiver.name}
        />
      </main>
    );
  }

  // --- 4. RENDER A FALLBACK UI ---
  // This will show if the user isn't logged in or if the engagement prop is malformed.
  return (
    <div className='text-muted-foreground p-4 text-center'>
      <h2>Chat Unavailable</h2>
      <p>Could not load the required user or engagement data.</p>
    </div>
  );
}
