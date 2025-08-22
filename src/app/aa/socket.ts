// import { Server, Socket } from "socket.io";
// import { chatUseCase } from "../../application/use-cases/chat.use-case.js";

// // 1. IMPORT THE ENUM FROM YOUR PRISMA CLIENT
// import { ChatMessageType } from "@prisma/client";

// // This helper function translates the client's string to the database's enum
// const getMessageTypeEnum = (typeString: string): ChatMessageType => {
//   const upperType = typeString.toUpperCase();

//   if (upperType in ChatMessageType) {
//     return upperType as ChatMessageType;
//   }

//   throw new Error(`Invalid message type received: '${typeString}'`);
// };

// export const registerChatHandlers = (io: Server) => {
//   io.on("connection", (socket: Socket) => {
//     console.log(
//       `📡 User connected: ${socket.id}, role: ${socket.data.authRole}`
//     );

//     // Join engagement-specific room
//     socket.on("join_thread", async (threadId: string) => {
//       socket.join(threadId);
//       console.log(`🔗 Socket ${socket.id} joined thread ${threadId}`);
//     });

//     // Send message
//     // socket.on("send_message", async (payload, callback) => {
//     //     try {
//     //         const { threadId, content, type } = payload;

//     //         // Call use case to store the message in DB
//     //         const message = await chatUseCase.createChatMessage({
//     //             thread: { connect: { id: threadId } },
//     //             senderId: socket.data.userId || socket.data.auditorId || socket.data.adminId,
//     //             content,
//     //             type
//     //         });

//     //         // Emit the message to all clients in the room
//     //         io.to(threadId).emit("new_message", message);

//     //         // Optional callback for sender confirmation
//     //         if (callback) callback({ success: true, message });
//     //     } catch (err: any) {
//     //         console.error("send_message error:", err);
//     //         if (callback) callback({ success: false, error: err.message });
//     //     }
//     // });
//     socket.on("send_message", async (payload, callback) => {
//       // --- STEP 1: ADD LOGGING AND VALIDATION ---
//       console.log(
//         `[send_message] Received payload from ${socket.id}:`,
//         payload
//       );
//       const senderId =
//         socket.data.userId || socket.data.auditorId || socket.data.adminId;
//       const { threadId, content, type, tempId } = payload;

//       // VALIDATE SENDER ID: Immediately stop if the sender is not authenticated.
//       if (!senderId) {
//         console.error(
//           `[send_message] Error: No senderId found for socket ${socket.id}. User not authenticated?`
//         );
//         if (callback) {
//           callback({
//             success: false,
//             error: "Authentication error: No sender ID.",
//           });
//         }
//         return; // Stop execution
//       }

//       // VALIDATE THREAD ID
//       if (!threadId) {
//         console.error(`[send_message] Error: No threadId provided.`);
//         if (callback) {
//           callback({
//             success: false,
//             error: "Bad request: No threadId provided.",
//           });
//         }
//         return; // Stop execution
//       }

//       try {
//         // --- STEP 2: LOG BEFORE AND AFTER THE DATABASE CALL ---
//         console.log(
//           `[send_message] Attempting to save message to DB for thread ${threadId}...`
//         );

//         const messageTypeEnum = getMessageTypeEnum(type);
//         const message = await chatUseCase.createChatMessage({
//           thread: { connect: { id: threadId } },
//           senderId: senderId, // Use the validated senderId
//           content,
//           type: messageTypeEnum,
//         });

//         console.log(
//           `[send_message] Message saved successfully. DB ID: ${message.id}`
//         );

//         // Emit the message to all clients in the room
//         io.to(threadId).emit("new_message", message);
//         console.log(
//           `[send_message] Emitted 'new_message' to thread ${threadId}.`
//         );

//         // Optional callback for sender confirmation
//         if (callback) {
//           callback({ success: true, message, tempId: tempId });
//           console.log(`[send_message] Acknowledgement sent to ${socket.id}.`);
//         }
//       } catch (err: any) {
//         console.error(
//           `[send_message] CATCH BLOCK ERROR for thread ${threadId}:`,
//           err
//         );
//         // Ensure the callback is ALWAYS called on error
//         if (callback) {
//           callback({
//             success: false,
//             error: err.message || "An internal server error occurred.",
//           });
//         }
//       }
//     });

//     // Load thread messages
//     socket.on("get_thread_messages", async (threadId: string, callback) => {
//       try {
//         const messages = await chatUseCase.getChatMessages({ threadId });
//         if (callback) callback({ success: true, messages });
//       } catch (err: any) {
//         if (callback) callback({ success: false, error: err.message });
//       }
//     });

//     // Handle disconnect
//     socket.on("disconnect", () => {
//       console.log(`❌ User disconnected: ${socket.id}`);
//     });
//   });
// };
