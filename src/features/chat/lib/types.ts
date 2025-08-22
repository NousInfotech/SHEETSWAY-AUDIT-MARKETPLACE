export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  threadId: string;
  senderId: string;
  sentAt: string;
  sender?: User;

  // --- ADD THESE NEW OPTIONAL FIELDS ---
  /** The delivery status of the message, managed on the client-side. */
  status?: 'sending' | 'sent' | 'failed';
  /** The error message if the status is 'failed'. */
  error?: string;
}