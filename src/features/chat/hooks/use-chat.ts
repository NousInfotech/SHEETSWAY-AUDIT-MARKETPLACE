'use client';

import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Message, User } from '@/features/chat/lib/types';
import { getFirebaseIdToken } from '@/lib/utils';

// The hook's props, which now include the currentUser
interface UseChatProps {
  threadId: string;
  currentUser: User;
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

/**
 * A comprehensive React hook for managing a real-time chat thread.
 * It handles connection, authentication, and message sending with a robust
 * optimistic update pattern that includes retry logic.
 */
export const useChat = ({ threadId, currentUser }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Do nothing if we don't have the necessary data
    if (!threadId || !currentUser) return;

    let socket: Socket;
    const connectSocket = async () => {
      const token = await getFirebaseIdToken();
      if (!token) {
        setError('Authentication failed: User is not signed in.');
        return;
      }

      socket = io(SOCKET_URL, {
        transports: ['websocket'],
        auth: { token: token, role: 'USER' }
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        setIsConnected(true);
        setError(null);
        socket.emit('join_thread', threadId);
        // Fetch initial messages for the thread
        socket.emit('get_thread_messages', threadId, (response: any) => {
          if (response.success && response.messages) {
            setMessages(response.messages);
          }
        });
      });

      socket.on('other_user_online', () => {
        console.log('[PRESENCE] Other user came online.');
        setIsReceiverOnline(true);
      });

      socket.on('other_user_offline', () => {
        console.log('[PRESENCE] Other user went offline.');
        setIsReceiverOnline(false);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        setIsReceiverOnline(false); // Can't know their status if we're not connected
      });
      socket.on('connect_error', (err) => setError(err.message));

      // This listener handles incoming messages from OTHER users in the room
      socket.on('new_message', (newMessage: Message) => {
        // We check the senderId to avoid duplicating our own optimistic messages
        if (newMessage.senderId !== currentUser.id) {
          setMessages((prevMessages) => {
            // Prevent adding a message if it somehow already exists
            if (prevMessages.some((msg) => msg.id === newMessage.id))
              return prevMessages;
            return [...prevMessages, newMessage];
          });
        }
      });
    };

    connectSocket();

    // Cleanup function to disconnect on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [threadId, currentUser]); // Effect dependencies

  /**
   * Sends a message using an optimistic update pattern with an "echoing ID".
   * Also handles retrying a previously failed message.
   * @param content The text content of the message.
   * @param type The type of the message (e.g., 'text').
   * @param failedMessageId If retrying, the ID of the failed message to remove.
   */
  const sendMessage = (
    content: string,
    type: 'text' | 'image' | 'file' = 'text',
    failedMessageId: string | null = null
  ) => {
    if (!socketRef.current?.connected || !content.trim()) {
      console.warn(
        'Cannot send message. Socket not connected or content is empty.'
      );
      return;
    }

    // 1. Create a unique temporary ID for this message.
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      content,
      type,
      senderId: currentUser.id, // Use the current user's ID
      threadId,
      sentAt: new Date().toISOString(),
      status: 'sending' // Set the initial status
    };

    // 2. Add the temporary "sending" message to the UI immediately.
    // If we are retrying, we also filter out the old "failed" message.
    setMessages((prev) => {
      const filtered = failedMessageId
        ? prev.filter((msg) => msg.id !== failedMessageId)
        : prev;
      return [...filtered, optimisticMessage];
    });

    // 3. Create the payload to send to the server, including the temporary ID.
    const payload = { threadId, content, type, tempId: tempId };

    // 4. Emit the event to the server.
    socketRef.current.emit(
      'send_message',
      payload,
      // The server will process the message and "echo" the tempId back in its response.
      (response: {
        success: boolean;
        message?: Message;
        error?: string;
        tempId?: string;
      }) => {
        // 5. Use the echoed tempId from the response to find and update the message.
        // This is guaranteed to be correct and is not affected by stale closures.
        if (response.success && response.message && response.tempId) {
          console.log(
            '[CLIENT] ✅ Server acknowledged message successfully:',
            response.message
          );
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === response.tempId // <-- Use the echoed tempId from the server
                ? { ...response.message!, status: 'sent' } // Replace temp message with the real one
                : msg
            )
          );
        } else {
          console.error(
            '[CLIENT] ❌ Server returned an error:',
            response.error
          );
          if (response.tempId) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === response.tempId
                  ? { ...msg, status: 'failed', error: response.error }
                  : msg
              )
            );
          }
        }
      }
    );
  };

  return { messages, isConnected, sendMessage, error, isReceiverOnline };
};
