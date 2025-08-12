// 'use client';

// import React, { useState, useRef, useCallback } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import SignatureCanvas from 'react-signature-canvas';
// import { Rnd, DraggableData, Position } from 'react-rnd';
// import { toast } from 'sonner';
// import { RotateCcw, Loader2 } from 'lucide-react';

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// // Configure the PDF worker using the stable CDN method.
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

// type Signature = {
//   id: number;
//   page: number;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   rotation: number;
//   dataUrl: string;
//   isNew?: boolean;
// };

// type SignatureModalProps = {
//   file: File;
//   onClose: () => void;
//   onSign: (signedFile: Blob) => void;
// };

// export const SignatureModal = ({
//   file,
//   onClose,
//   onSign
// }: SignatureModalProps) => {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [isPdfLoaded, setIsPdfLoaded] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
//   const [typedSignature, setTypedSignature] = useState('');
//   const [signatures, setSignatures] = useState<Signature[]>([]);
//   const [activeSignatureId, setActiveSignatureId] = useState<number | null>(
//     null
//   );

//   const sigPadRef = useRef<SignatureCanvas>(null);
//   const pageRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
//   const animationFrameRef = useRef<number | null>(null);
//   const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

//   const onDocumentLoadSuccess = useCallback(
//     ({ numPages }: { numPages: number }) => {
//       setNumPages(numPages);
//       pageRefs.current = new Map();
//       setIsPdfLoaded(true);
//     },
//     []
//   );

//   const clearSignature = () => {
//     if (signatureMode === 'draw') sigPadRef.current?.clear();
//     setTypedSignature('');
//     if (signatures.length > 0) {
//       setSignatures([]);
//       setActiveSignatureId(null);
//       toast.info('Signature and all placements have been cleared.');
//     }
//   };

//   const stopScrolling = () => {
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//       animationFrameRef.current = null;
//     }
//   };

//   const scrollStep = () => {
//     const scrollContainer = scrollContainerRef.current;
//     if (!scrollContainer) {
//       stopScrolling();
//       return;
//     }
//     const { top, bottom, height } = scrollContainer.getBoundingClientRect();
//     const mouseY = lastMousePos.current.y;
//     const hotZone = height * 0.1;
//     const maxScrollSpeed = 20;
//     let scrollAmount = 0;
//     if (mouseY < top + hotZone) {
//       const intensity = (top + hotZone - mouseY) / hotZone;
//       scrollAmount = -maxScrollSpeed * intensity;
//     } else if (mouseY > bottom - hotZone) {
//       const intensity = (mouseY - (bottom - hotZone)) / hotZone;
//       scrollAmount = maxScrollSpeed * intensity;
//     }
//     if (scrollAmount !== 0) {
//       scrollContainer.scrollTop += scrollAmount;
//       animationFrameRef.current = requestAnimationFrame(scrollStep);
//     } else {
//       stopScrolling();
//     }
//   };

//   const handleDrag = (e: any, data: DraggableData) => {

//     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//     lastMousePos.current = { x: data.x, y: clientY };

//     if (!animationFrameRef.current) {
//       animationFrameRef.current = requestAnimationFrame(scrollStep);
//     }

//     const sig = signatures.find((s) => s.id === activeSignatureId);
//     if (!sig) return;

//     let targetPageInfo: { num: number; ref: HTMLDivElement } | null = null;
//     const pageEntries = Array.from(pageRefs.current.entries());

//     for (const [pageNum, pRef] of pageEntries) {
//       if (pRef) {
//         const pageTop = pRef.offsetTop;
//         const pageBottom = pageTop + pRef.offsetHeight;
//         if (
//           data.y + sig.height / 2 >= pageTop &&
//           data.y + sig.height / 2 < pageBottom
//         ) {
//           targetPageInfo = { num: pageNum, ref: pRef };
//           break;
//         }
//       }
//     }

//     if (targetPageInfo) {
//       const newRelativeX = data.x - targetPageInfo.ref.offsetLeft;
//       const newRelativeY = data.y - targetPageInfo.ref.offsetTop;
//       setSignatures((prev) =>
//         prev.map((s) =>
//           s.id === activeSignatureId
//             ? {
//                 ...s,
//                 page: targetPageInfo!.num,
//                 x: newRelativeX,
//                 y: newRelativeY
//               }
//             : s
//         )
//       );
//     }
//   };

//   const saveAndPlaceSignature = async () => {
//     if (isCreating) return;

//     const validationError =
//       signatureMode === 'draw'
//         ? sigPadRef.current?.isEmpty()
//           ? 'Please provide a signature first.'
//           : null
//         : !typedSignature.trim()
//           ? 'Please type your name first.'
//           : null;

//     if (validationError) {
//       toast.error(validationError);
//       return;
//     }

//     setIsCreating(true);
//     await new Promise((resolve) => setTimeout(resolve, 0));

//     try {
//       let dataUrl: string | null = null;
//       if (signatureMode === 'draw') {
//         dataUrl = sigPadRef.current!.getTrimmedCanvas().toDataURL('image/png');
//       } else {
//         const canvas = document.createElement('canvas');
//         canvas.width = 400;
//         canvas.height = 120;
//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//           ctx.font = '70px "Great Vibes", cursive';
//           ctx.fillStyle = 'black';
//           ctx.fillText(typedSignature, 20, 80);
//           dataUrl = canvas.toDataURL('image/png');
//         } else {
//           throw new Error('Could not get canvas context');
//         }
//       }

//       if (dataUrl) {
//         const newSignature: Signature = {
//           id: Date.now(),
//           page: 1,
//           x: 100,
//           y: 100,
//           width: signatureMode === 'draw' ? 150 : 220,
//           height: signatureMode === 'draw' ? 75 : 100,
//           rotation: 0,
//           dataUrl,
//           isNew: true
//         };
//         setSignatures((prev) => [...prev, newSignature]);
//         setActiveSignatureId(newSignature.id);

//         const makeVisible = () => {
//           setSignatures((prev) =>
//             prev.map((s) =>
//               s.id === newSignature.id ? { ...s, isNew: false } : s
//             )
//           );
//         };

//         toast.success(
//           'Signature created. You can now move, resize, and rotate it.',
//           {
//             onDismiss: makeVisible,
//             onAutoClose: makeVisible
//           }
//         );

//         setTimeout(() => setIsCreating(false), 100);
//       } else {
//         setIsCreating(false);
//       }
//     } catch (error) {
//       console.error('Failed to create signature:', error);
//       toast.error(
//         'An error occurred while creating the signature. Please try again.'
//       );
//       setIsCreating(false);
//     }
//   };

//   const handleRotation = (signatureId: number, e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setSignatures((prev) =>
//       prev.map((sig) =>
//         sig.id === signatureId
//           ? { ...sig, rotation: (sig.rotation + 15) % 360 }
//           : sig
//       )
//     );
//   };

//   const handleFinalSign = async () => {
//     /* ... Unchanged ... */
//   };

//   return (
//     <div className='bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm'>
//       <div className='relative flex h-[95vh] w-[95vw] max-w-6xl flex-col rounded-lg bg-white shadow-2xl'>
//         <header className='flex flex-shrink-0 items-center justify-between border-b p-4'>
//           <h2 className='text-xl font-bold'>Sign Document: {file.name}</h2>
//           <button
//             onClick={onClose}
//             className='rounded-full p-2 text-2xl leading-none hover:bg-gray-200'
//           >
//             &times;
//           </button>
//         </header>
//         <div className='flex flex-grow overflow-hidden'>
//           <div
//             ref={scrollContainerRef}
//             id='pdf-scroll-container'
//             className='relative flex-1 overflow-y-auto bg-gray-100 p-4'
//             onClick={() => setActiveSignatureId(null)}
//           >
//             {!isPdfLoaded && (
//               <div className='bg-opacity-90 absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100'>
//                 <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
//                 <p className='mt-4 text-lg text-gray-700'>
//                   Preparing Document...
//                 </p>
//               </div>
//             )}

//             <div className='relative'>
//               <Document
//                 file={file}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 onLoadError={(error) =>
//                   toast.error(`Error loading PDF: ${error.message}`)
//                 }
//               >
//                 {Array.from(new Array(numPages ?? 0), (el, index) => (
//                   <div
//                     key={`page_${index + 1}`}
//                     ref={(el) => {
//                       if (el) pageRefs.current.set(index + 1, el);
//                       else pageRefs.current.delete(index + 1);
//                     }}
//                     className='relative mb-4 flex justify-center'
//                   >
//                     <Page pageNumber={index + 1} />
//                   </div>
//                 ))}
//               </Document>

//               {isPdfLoaded &&
//                 signatures.map((sig) => {
//                   const isActive = sig.id === activeSignatureId;
//                   const pageRef = pageRefs.current.get(sig.page);
//                   if (!pageRef) return null;

//                   const absolutePosition = {
//                     x: pageRef.offsetLeft + sig.x,
//                     y: pageRef.offsetTop + sig.y
//                   };

//                   return (
//                     <Rnd
//                       key={sig.id}
//                       size={{ width: sig.width, height: sig.height }}
//                       position={absolutePosition}
//                       // FIX: Use onClick for selection, onMouseDown to prepare for drag
//                       onClick={(e: React.MouseEvent<HTMLDivElement>) => {
//                         e.stopPropagation();
//                         setActiveSignatureId(sig.id);
//                       }}
//                       onDragStart={(e, d) => setActiveSignatureId(sig.id)}
//                       onDrag={handleDrag}
//                       onDragStop={stopScrolling}
//                       onResizeStart={stopScrolling}
//                       onResizeStop={(
//                         e,
//                         direction,
//                         ref,
//                         delta,
//                         position: Position
//                       ) => {
//                         const currentPageRef = pageRefs.current.get(sig.page);
//                         if (currentPageRef) {
//                           setSignatures((prev) =>
//                             prev.map((s) =>
//                               s.id === sig.id
//                                 ? {
//                                     ...s,
//                                     width: parseInt(ref.style.width),
//                                     height: parseInt(ref.style.height),
//                                     x: position.x - currentPageRef.offsetLeft,
//                                     y: position.y - currentPageRef.offsetTop
//                                   }
//                                 : s
//                             )
//                           );
//                         }
//                       }}
//                       bounds='#pdf-scroll-container'
//                       className={`pointer-events-auto cursor-move ${isActive ? 'border-2 border-dashed border-blue-500' : 'border-2 border-transparent'} transition-opacity duration-200 ${sig.isNew ? 'opacity-0' : 'opacity-100'}`}
//                       style={{
//                         zIndex: isActive ? 21 : 20,
//                         transform: `rotate(${sig.rotation}deg)`
//                       }}
//                       dragHandleClassName='signature-drag-handle'
//                     >
//                       <div className='signature-drag-handle h-full w-full'>
//                         <img
//                           src={sig.dataUrl}
//                           alt='Signature'
//                           className='h-full w-full'
//                         />
//                       </div>
//                       {isActive && (
//                         <div onMouseDown={(e) => e.stopPropagation()}>
//                           <div
//                             onMouseDown={(e) => handleRotation(sig.id, e)}
//                             className='absolute -top-3 -right-3 cursor-alias rounded-full bg-blue-500 p-1 text-white hover:bg-blue-700'
//                           >
//                             <RotateCcw size={16} />
//                           </div>
//                         </div>
//                       )}
//                     </Rnd>
//                   );
//                 })}
//             </div>
//           </div>
//           <aside
//             className={`w-80 flex-shrink-0 border-l bg-gray-50 p-4 transition-opacity duration-300 ${!isPdfLoaded ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
//           >
//             <h3 className='text-lg font-semibold'>Create Your Signature</h3>
//             <Tabs
//               value={signatureMode}
//               onValueChange={(value) =>
//                 setSignatureMode(value as 'draw' | 'type')
//               }
//               className='mt-2 w-full'
//             >
//               <TabsList className='grid w-full grid-cols-2'>
//                 <TabsTrigger value='draw'>Draw</TabsTrigger>
//                 <TabsTrigger value='type'>Type</TabsTrigger>
//               </TabsList>
//               <TabsContent value='draw'>
//                 <div className='mt-4 rounded-md border-2 border-blue-500'>
//                   <SignatureCanvas
//                     ref={sigPadRef}
//                     penColor='black'
//                     canvasProps={{
//                       width: 284,
//                       height: 150,
//                       className: 'sigCanvas'
//                     }}
//                   />
//                 </div>
//               </TabsContent>
//               <TabsContent value='type'>
//                 <div
//                   className='mt-4 flex flex-col items-center justify-center rounded-md border-2 border-blue-500 p-4'
//                   style={{ height: 154 }}
//                 >
//                   <Input
//                     placeholder='Type your name'
//                     value={typedSignature}
//                     onChange={(e) => setTypedSignature(e.target.value)}
//                     className='border-b-2 border-gray-400 text-center text-4xl'
//                     style={{ fontFamily: '"Great Vibes", cursive' }}
//                   />
//                 </div>
//               </TabsContent>
//             </Tabs>
//             <div className='mt-4 flex gap-2'>
//               <Button
//                 variant='outline'
//                 onClick={clearSignature}
//                 disabled={isCreating}
//               >
//                 Clear
//               </Button>
//               <Button onClick={saveAndPlaceSignature} disabled={isCreating}>
//                 {isCreating ? (
//                   <>
//                     <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                     Creating...
//                   </>
//                 ) : (
//                   'Create & Add Signature'
//                 )}
//               </Button>
//             </div>
//             <hr className='my-6' />
//             <div className='flex flex-col gap-2'>
//               <Button
//                 size='lg'
//                 onClick={handleFinalSign}
//                 disabled={signatures.length === 0}
//                 className='bg-green-600 hover:bg-green-700'
//               >
//                 Apply & Finalize
//               </Button>
//               <Button size='lg' variant='destructive' onClick={onClose}>
//                 Cancel
//               </Button>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };

// ################################################################################################

// components/ui/SignatureModal.tsx

// 'use client';

// import React, { useState, useRef, useCallback } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import SignatureCanvas from 'react-signature-canvas';
// import { Rnd, DraggableData, Position } from 'react-rnd';
// import { toast } from 'sonner';
// import { RotateCcw, Loader2 } from 'lucide-react';

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// // Configure the PDF worker using the stable CDN method.
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

// type Signature = {
//   id: number;
//   page: number;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   rotation: number;
//   dataUrl: string;
//   isNew?: boolean;
// };

// type SignatureModalProps = {
//   file: File;
//   onClose: () => void;
//   onSign: (signedFile: Blob) => void;
// };

// export const SignatureModal = ({
//   file,
//   onClose,
//   onSign
// }: SignatureModalProps) => {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [isPdfLoaded, setIsPdfLoaded] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
//   const [typedSignature, setTypedSignature] = useState('');
//   const [signatures, setSignatures] = useState<Signature[]>([]);
//   const [activeSignatureId, setActiveSignatureId] = useState<number | null>(
//     null
//   );

//   const sigPadRef = useRef<SignatureCanvas>(null);
//   const pageRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
//   const animationFrameRef = useRef<number | null>(null);
//   const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

//   const onDocumentLoadSuccess = useCallback(
//     ({ numPages }: { numPages: number }) => {
//       setNumPages(numPages);
//       pageRefs.current = new Map();
//       setIsPdfLoaded(true);
//     },
//     []
//   );

//   const clearSignature = () => {
//     if (signatureMode === 'draw') sigPadRef.current?.clear();
//     setTypedSignature('');
//     if (signatures.length > 0) {
//       setSignatures([]);
//       setActiveSignatureId(null);
//       toast.info('Signature and all placements have been cleared.');
//     }
//   };

//   const stopScrolling = () => {
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//       animationFrameRef.current = null;
//     }
//   };

//   const scrollStep = () => {
//     const scrollContainer = scrollContainerRef.current;
//     if (!scrollContainer) {
//       stopScrolling();
//       return;
//     }
//     const { top, bottom, height } = scrollContainer.getBoundingClientRect();
//     const mouseY = lastMousePos.current.y;
//     const hotZone = height * 0.1;
//     const maxScrollSpeed = 20;
//     let scrollAmount = 0;
//     if (mouseY < top + hotZone) {
//       const intensity = (top + hotZone - mouseY) / hotZone;
//       scrollAmount = -maxScrollSpeed * intensity;
//     } else if (mouseY > bottom - hotZone) {
//       const intensity = (mouseY - (bottom - hotZone)) / hotZone;
//       scrollAmount = maxScrollSpeed * intensity;
//     }
//     if (scrollAmount !== 0) {
//       scrollContainer.scrollTop += scrollAmount;
//       animationFrameRef.current = requestAnimationFrame(scrollStep);
//     } else {
//       stopScrolling();
//     }
//   };

//   const handleDrag = (e: any, data: DraggableData) => {
//     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//     lastMousePos.current = { x: data.x, y: clientY };

//     if (!animationFrameRef.current) {
//       animationFrameRef.current = requestAnimationFrame(scrollStep);
//     }

//     const sig = signatures.find((s) => s.id === activeSignatureId);
//     if (!sig) return;

//     let targetPageInfo: { num: number; ref: HTMLDivElement } | null = null;
//     const pageEntries = Array.from(pageRefs.current.entries());

//     for (const [pageNum, pRef] of pageEntries) {
//       if (pRef) {
//         const pageTop = pRef.offsetTop;
//         const pageBottom = pageTop + pRef.offsetHeight;
//         if (
//           data.y + sig.height / 2 >= pageTop &&
//           data.y + sig.height / 2 < pageBottom
//         ) {
//           targetPageInfo = { num: pageNum, ref: pRef };
//           break;
//         }
//       }
//     }

//     if (targetPageInfo) {
//       const newRelativeX = data.x - targetPageInfo.ref.offsetLeft;
//       const newRelativeY = data.y - targetPageInfo.ref.offsetTop;
//       setSignatures((prev) =>
//         prev.map((s) =>
//           s.id === activeSignatureId
//             ? {
//                 ...s,
//                 page: targetPageInfo!.num,
//                 x: newRelativeX,
//                 y: newRelativeY
//               }
//             : s
//         )
//       );
//     }
//   };

//   const saveAndPlaceSignature = async () => {
//     if (isCreating) return;

//     const validationError =
//       signatureMode === 'draw'
//         ? sigPadRef.current?.isEmpty()
//           ? 'Please provide a signature first.'
//           : null
//         : !typedSignature.trim()
//           ? 'Please type your name first.'
//           : null;

//     if (validationError) {
//       toast.error(validationError);
//       return;
//     }

//     setIsCreating(true);
//     await new Promise((resolve) => setTimeout(resolve, 0));

//     try {
//       let dataUrl: string | null = null;
//       if (signatureMode === 'draw') {
//         dataUrl = sigPadRef.current!.getTrimmedCanvas().toDataURL('image/png');
//       } else {
//         const canvas = document.createElement('canvas');
//         canvas.width = 400;
//         canvas.height = 120;
//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//           ctx.font = '70px "Great Vibes", cursive';
//           ctx.fillStyle = 'black';
//           ctx.fillText(typedSignature, 20, 80);
//           dataUrl = canvas.toDataURL('image/png');
//         } else {
//           throw new Error('Could not get canvas context');
//         }
//       }

//       if (dataUrl) {
//         const newSignature: Signature = {
//           id: Date.now(),
//           page: 1,
//           x: 100,
//           y: 100,
//           width: signatureMode === 'draw' ? 150 : 220,
//           height: signatureMode === 'draw' ? 75 : 100,
//           rotation: 0,
//           dataUrl,
//           isNew: true
//         };
//         setSignatures((prev) => [...prev, newSignature]);
//         setActiveSignatureId(newSignature.id);

//         const makeVisible = () => {
//           setSignatures((prev) =>
//             prev.map((s) =>
//               s.id === newSignature.id ? { ...s, isNew: false } : s
//             )
//           );
//         };

//         toast.success(
//           'Signature created. You can now move, resize, and rotate it.',
//           {
//             onDismiss: makeVisible,
//             onAutoClose: makeVisible
//           }
//         );

//         setTimeout(() => setIsCreating(false), 100);
//       } else {
//         setIsCreating(false);
//       }
//     } catch (error) {
//       console.error('Failed to create signature:', error);
//       toast.error(
//         'An error occurred while creating the signature. Please try again.'
//       );
//       setIsCreating(false);
//     }
//   };

//   const handleRotation = (signatureId: number, e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setSignatures((prev) =>
//       prev.map((sig) =>
//         sig.id === signatureId
//           ? { ...sig, rotation: (sig.rotation + 15) % 360 }
//           : sig
//       )
//     );
//   };

//   // FIX: This function is now fully implemented.
//   const handleFinalSign = async () => {
//     if (signatures.length === 0) {
//       toast.error('Please create and add at least one signature.');
//       return;
//     }
//     toast.info('Signing process started...');
//     console.log({
//       message: 'Simulating final signature...',
//       originalFile: file,
//       signatures
//     });
//     // In a real application, you would use a library like `pdf-lib` here to
//     // embed the signature images onto the actual PDF Blob.
//     const signedBlob = new Blob([await file.arrayBuffer()], {
//       type: 'application/pdf'
//     });
//     onSign(signedBlob);
//     toast.success('Document has been successfully signed!');
//   };

//   return (
//     <div className='bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm'>
//       <div className='relative flex h-[95vh] w-[95vw] max-w-6xl flex-col rounded-lg bg-white shadow-2xl'>
//         <header className='flex flex-shrink-0 items-center justify-between border-b p-4'>
//           <h2 className='text-xl font-bold'>Sign Document: {file.name}</h2>
//           <button
//             onClick={onClose}
//             className='rounded-full p-2 text-2xl leading-none hover:bg-gray-200'
//           >
//             &times;
//           </button>
//         </header>
//         <div className='flex flex-grow overflow-hidden'>
//           <div
//             ref={scrollContainerRef}
//             id='pdf-scroll-container'
//             className='relative flex-1 overflow-y-auto bg-gray-100 p-4'
//             onClick={() => setActiveSignatureId(null)}
//           >
//             {!isPdfLoaded && (
//               <div className='bg-opacity-90 absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100'>
//                 <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
//                 <p className='mt-4 text-lg text-gray-700'>
//                   Preparing Document...
//                 </p>
//               </div>
//             )}

//             <div className='relative'>
//               <Document
//                 file={file}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 onLoadError={(error) =>
//                   toast.error(`Error loading PDF: ${error.message}`)
//                 }
//               >
//                 {Array.from(new Array(numPages ?? 0), (el, index) => (
//                   <div
//                     key={`page_${index + 1}`}
//                     ref={(el) => {
//                       if (el) pageRefs.current.set(index + 1, el);
//                       else pageRefs.current.delete(index + 1);
//                     }}
//                     className='relative mb-4 flex justify-center'
//                   >
//                     <Page pageNumber={index + 1} />
//                   </div>
//                 ))}
//               </Document>

//               {isPdfLoaded &&
//                 signatures.map((sig) => {
//                   const isActive = sig.id === activeSignatureId;
//                   const pageRef = pageRefs.current.get(sig.page);
//                   if (!pageRef) return null;

//                   const absolutePosition = {
//                     x: pageRef.offsetLeft + sig.x,
//                     y: pageRef.offsetTop + sig.y
//                   };

//                   return (
//                     <Rnd
//                       key={sig.id}
//                       size={{ width: sig.width, height: sig.height }}
//                       position={absolutePosition}
//                       // FIX: The click handler is now correctly typed and implemented.
//                       onClick={(e: React.MouseEvent<HTMLDivElement>) => {
//                         e.stopPropagation();
//                         setActiveSignatureId(sig.id);
//                       }}
//                       onDragStart={(e, d) => setActiveSignatureId(sig.id)}
//                       onDrag={handleDrag}
//                       onDragStop={stopScrolling}
//                       onResizeStart={stopScrolling}
//                       onResizeStop={(
//                         e,
//                         direction,
//                         ref,
//                         delta,
//                         position: Position
//                       ) => {
//                         const currentPageRef = pageRefs.current.get(sig.page);
//                         if (currentPageRef) {
//                           setSignatures((prev) =>
//                             prev.map((s) =>
//                               s.id === sig.id
//                                 ? {
//                                     ...s,
//                                     width: parseInt(ref.style.width),
//                                     height: parseInt(ref.style.height),
//                                     x: position.x - currentPageRef.offsetLeft,
//                                     y: position.y - currentPageRef.offsetTop
//                                   }
//                                 : s
//                             )
//                           );
//                         }
//                       }}
//                       bounds='#pdf-scroll-container'
//                       className={`pointer-events-auto cursor-move ${isActive ? 'border-2 border-dashed border-blue-500' : 'border-2 border-transparent'} transition-opacity duration-200 ${sig.isNew ? 'opacity-0' : 'opacity-100'}`}
//                       style={{
//                         zIndex: isActive ? 21 : 20,
//                         transform: `rotate(${sig.rotation}deg)`
//                       }}
//                       dragHandleClassName='signature-drag-handle'
//                     >
//                       <div className='signature-drag-handle h-full w-full'>
//                         <img
//                           src={sig.dataUrl}
//                           alt='Signature'
//                           className='h-full w-full'
//                         />
//                       </div>
//                       {isActive && (
//                         <div onMouseDown={(e) => e.stopPropagation()}>
//                           <div
//                             onMouseDown={(e) => handleRotation(sig.id, e)}
//                             className='absolute -top-3 -right-3 cursor-alias rounded-full bg-blue-500 p-1 text-white hover:bg-blue-700'
//                           >
//                             <RotateCcw size={16} />
//                           </div>
//                         </div>
//                       )}
//                     </Rnd>
//                   );
//                 })}
//             </div>
//           </div>
//           <aside
//             className={`w-80 flex-shrink-0 border-l bg-gray-50 p-4 transition-opacity duration-300 ${!isPdfLoaded ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
//           >
//             <h3 className='text-lg font-semibold'>Create Your Signature</h3>
//             <Tabs
//               value={signatureMode}
//               onValueChange={(value) =>
//                 setSignatureMode(value as 'draw' | 'type')
//               }
//               className='mt-2 w-full'
//             >
//               <TabsList className='grid w-full grid-cols-2'>
//                 <TabsTrigger value='draw'>Draw</TabsTrigger>
//                 <TabsTrigger value='type'>Type</TabsTrigger>
//               </TabsList>
//               <TabsContent value='draw'>
//                 <div className='mt-4 rounded-md border-2 border-blue-500'>
//                   <SignatureCanvas
//                     ref={sigPadRef}
//                     penColor='black'
//                     canvasProps={{
//                       width: 284,
//                       height: 150,
//                       className: 'sigCanvas'
//                     }}
//                   />
//                 </div>
//               </TabsContent>
//               <TabsContent value='type'>
//                 <div
//                   className='mt-4 flex flex-col items-center justify-center rounded-md border-2 border-blue-500 p-4'
//                   style={{ height: 154 }}
//                 >
//                   <Input
//                     placeholder='Type your name'
//                     value={typedSignature}
//                     onChange={(e) => setTypedSignature(e.target.value)}
//                     className='border-b-2 border-gray-400 text-center text-4xl'
//                     style={{ fontFamily: '"Great Vibes", cursive' }}
//                   />
//                 </div>
//               </TabsContent>
//             </Tabs>
//             <div className='mt-4 flex gap-2'>
//               <Button
//                 variant='outline'
//                 onClick={clearSignature}
//                 disabled={isCreating}
//               >
//                 Clear
//               </Button>
//               <Button onClick={saveAndPlaceSignature} disabled={isCreating}>
//                 {isCreating ? (
//                   <>
//                     <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                     Creating...
//                   </>
//                 ) : (
//                   'Create & Add Signature'
//                 )}
//               </Button>
//             </div>
//             <hr className='my-6' />
//             <div className='flex flex-col gap-2'>
//               <Button
//                 size='lg'
//                 onClick={handleFinalSign}
//                 disabled={signatures.length === 0}
//                 className='bg-green-600 hover:bg-green-700'
//               >
//                 Apply & Finalize
//               </Button>
//               <Button size='lg' variant='destructive' onClick={onClose}>
//                 Cancel
//               </Button>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };

// #############################################################################################################

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { Rnd, DraggableData, Position } from 'react-rnd';
import { toast } from 'sonner';
import { RotateCcw, Loader2, Download, Upload } from 'lucide-react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect } from 'react';

// Configure the PDF worker using the stable CDN method.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

type Signature = {
  id: number;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  dataUrl: string;
  isNew?: boolean;
};

type SignatureModalProps = {
  file: File;
  onClose: () => void;
  onSign: (signedFile: Blob) => void;
};

export const SignatureModal = ({
  file,
  onClose,
  onSign
}: SignatureModalProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  // const [isPdfLoaded, setIsPdfLoaded] = useState(false);
  const [loadingState, setLoadingState] = useState<
    'preparing' | 'rendering' | 'ready'
  >('preparing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<
    'draw' | 'type' | 'upload'
  >('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [activeSignatureId, setActiveSignatureId] = useState<number | null>(
    null
  );

  const sigPadRef = useRef<SignatureCanvas>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // FIX: Add cleanup for the requestAnimationFrame to prevent memory leaks
  useEffect(() => {
    // This is the cleanup function. It runs when the component is unmounted.
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      pageRefs.current = new Map();

      // Set the state to 'rendering'. This puts the <Page> components into the DOM.
      setLoadingState('rendering');

      // FIX: Use the double requestAnimationFrame pattern instead of setTimeout.
      // This reliably waits for the browser to finish painting the PDF.
      animationFrameId.current = requestAnimationFrame(() => {
        // At this point, the browser has acknowledged the new DOM elements but hasn't
        // necessarily painted them. We schedule another frame.
        animationFrameId.current = requestAnimationFrame(() => {
          // By the time this second callback runs, the previous frame's heavy
          // painting work is complete. The UI is now truly ready and responsive.
          setLoadingState('ready');
        });
      });
    },
    [] // The dependency array is empty, which is correct for this callback.
  );

  const clearSignature = () => {
    if (signatureMode === 'draw') sigPadRef.current?.clear();
    setTypedSignature('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (signatures.length > 0) {
      setSignatures([]);
      setActiveSignatureId(null);
      toast.info('Signature and all placements have been cleared.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        placeImportedSignature(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const placeImportedSignature = (dataUrl: string) => {
    const newSignature: Signature = {
      id: Date.now(),
      page: 1,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 0,
      dataUrl,
      isNew: true
    };
    setSignatures((prev) => [...prev, newSignature]);
    setActiveSignatureId(newSignature.id);
    toast.success('Signature imported. You can now place it on the document.');
    setTimeout(
      () =>
        setSignatures((prev) =>
          prev.map((s) =>
            s.id === newSignature.id ? { ...s, isNew: false } : s
          )
        ),
      100
    );
  };

  const stopScrolling = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const scrollStep = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      stopScrolling();
      return;
    }
    const { top, bottom, height } = scrollContainer.getBoundingClientRect();
    const mouseY = lastMousePos.current.y;
    const hotZone = height * 0.1;
    const maxScrollSpeed = 20;
    let scrollAmount = 0;
    if (mouseY < top + hotZone) {
      const intensity = (top + hotZone - mouseY) / hotZone;
      scrollAmount = -maxScrollSpeed * intensity;
    } else if (mouseY > bottom - hotZone) {
      const intensity = (mouseY - (bottom - hotZone)) / hotZone;
      scrollAmount = maxScrollSpeed * intensity;
    }
    if (scrollAmount !== 0) {
      scrollContainer.scrollTop += scrollAmount;
      animationFrameRef.current = requestAnimationFrame(scrollStep);
    } else {
      stopScrolling();
    }
  };

  const handleDrag = (e: any, data: DraggableData) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastMousePos.current = { x: data.x, y: clientY };

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(scrollStep);
    }

    const sig = signatures.find((s) => s.id === activeSignatureId);
    if (!sig) return;

    let targetPageInfo: { num: number; ref: HTMLDivElement } | null = null;
    const pageEntries = Array.from(pageRefs.current.entries());

    for (const [pageNum, pRef] of pageEntries) {
      if (pRef) {
        const pageTop = pRef.offsetTop;
        const pageBottom = pageTop + pRef.offsetHeight;
        if (
          data.y + sig.height / 2 >= pageTop &&
          data.y + sig.height / 2 < pageBottom
        ) {
          targetPageInfo = { num: pageNum, ref: pRef };
          break;
        }
      }
    }

    if (targetPageInfo) {
      const newRelativeX = data.x - targetPageInfo.ref.offsetLeft;
      const newRelativeY = data.y - targetPageInfo.ref.offsetTop;
      setSignatures((prev) =>
        prev.map((s) =>
          s.id === activeSignatureId
            ? {
                ...s,
                page: targetPageInfo!.num,
                x: newRelativeX,
                y: newRelativeY
              }
            : s
        )
      );
    }
  };

  const saveAndPlaceSignature = async () => {
    if (isProcessing) return;

    const validationError =
      signatureMode === 'draw'
        ? sigPadRef.current?.isEmpty()
          ? 'Please provide a signature first.'
          : null
        : !typedSignature.trim()
          ? 'Please type your name first.'
          : null;

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      let dataUrl: string | null = null;
      if (signatureMode === 'draw') {
        dataUrl = sigPadRef.current!.toDataURL('image/png');
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = '70px "Great Vibes", cursive';
          ctx.fillStyle = 'black';
          ctx.fillText(typedSignature, 20, 80);
          dataUrl = canvas.toDataURL('image/png');
        } else {
          throw new Error('Could not get canvas context');
        }
      }

      if (dataUrl) {
        const newSignature: Signature = {
          id: Date.now(),
          page: 1,
          x: 100,
          y: 100,
          width: signatureMode === 'draw' ? 150 : 220,
          height: signatureMode === 'draw' ? 75 : 100,
          rotation: 0,
          dataUrl,
          isNew: true
        };
        setSignatures((prev) => [...prev, newSignature]);
        setActiveSignatureId(newSignature.id);

        const makeVisible = () => {
          setSignatures((prev) =>
            prev.map((s) =>
              s.id === newSignature.id ? { ...s, isNew: false } : s
            )
          );
        };

        toast.success(
          'Signature created. You can now move, resize, and rotate it.',
          {
            onDismiss: makeVisible,
            onAutoClose: makeVisible
          }
        );

        setTimeout(() => setIsProcessing(false), 100);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Failed to create signature:', error);
      toast.error(
        'An error occurred while creating the signature. Please try again.'
      );
      setIsProcessing(false);
    }
  };

  const handleRotation = (signatureId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSignatures((prev) =>
      prev.map((sig) =>
        sig.id === signatureId
          ? { ...sig, rotation: (sig.rotation + 15) % 360 }
          : sig
      )
    );
  };

  // FIX: This function now correctly scales coordinates from screen pixels to PDF points.
  const applySignaturesToPdf = async (): Promise<Blob> => {
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
    const pages = pdfDoc.getPages();

    for (const sig of signatures) {
      const page = pages[sig.page - 1];
      const pageRef = pageRefs.current.get(sig.page);

      if (!pageRef) {
        console.warn(`Could not find page reference for page ${sig.page}`);
        continue;
      }

      // --- START: CRITICAL FIX FOR COORDINATE TRANSLATION ---

      // 1. Find the actual <canvas> rendered by react-pdf inside our page div.
      const canvas = pageRef.querySelector('canvas');
      if (!canvas) {
        console.error(`Could not find canvas for page ${sig.page}`);
        continue;
      }

      // 2. Get the dimensions of the rendered canvas (in pixels). This is our source of truth.
      const canvasRect = canvas.getBoundingClientRect();
      const pageRefRect = pageRef.getBoundingClientRect();

      // 3. Get the dimensions of the actual PDF page (in points).
      const { width: pdfPageWidth, height: pdfPageHeight } = page.getSize();

      // 4. Calculate the scaling factors. We use the canvas's actual rendered size.
      const scaleX = pdfPageWidth / canvasRect.width;
      const scaleY = pdfPageHeight / canvasRect.height;

      // 5. Calculate the signature's position relative to the CANVAS, not the container div.
      // This accounts for the horizontal centering (`justify-center`).
      const sigX_relativeToCanvas =
        sig.x - (canvasRect.left - pageRefRect.left);
      const sigY_relativeToCanvas = sig.y - (canvasRect.top - pageRefRect.top);

      // 6. Scale the signature's relative position and dimensions to PDF points.
      const sigXInPoints = sigX_relativeToCanvas * scaleX;
      const sigYInPoints = sigY_relativeToCanvas * scaleY;
      const sigWidthInPoints = sig.width * scaleX;
      const sigHeightInPoints = sig.height * scaleY;

      // --- END: CRITICAL FIX ---

      // Embed the signature image
      const pngImage = await pdfDoc.embedPng(sig.dataUrl);

      // Draw the image using the correctly scaled and positioned coordinates.
      // The Y-coordinate is flipped for pdf-lib's bottom-left origin system.
      page.drawImage(pngImage, {
        x: sigXInPoints,
        y: pdfPageHeight - sigYInPoints - sigHeightInPoints, // Y-flip based on PDF page height
        width: sigWidthInPoints,
        height: sigHeightInPoints,
        rotate: degrees(sig.rotation * -1)
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes.slice()], { type: 'application/pdf' });
  };

  const handleFinalSign = async () => {
    if (signatures.length === 0) {
      toast.error('Please place at least one signature on the document.');
      return;
    }
    setIsProcessing(true);
    toast.info('Applying signatures...');

    try {
      // Create the signed PDF
      const signedPdfBlob = await applySignaturesToPdf();

      // Pass the signed PDF back to the parent component
      onSign(signedPdfBlob);

      // Explicitly call the function to close the modal
      onClose();

      toast.success('Document signed successfully!');
    } catch (error) {
      console.error('Error signing document:', error);
      toast.error('Failed to sign the document. Please try again.');
      // Keep the modal open on failure so the user can retry
    } finally {
      // We no longer need to set processing to false here,
      // because the component will be unmounted/closed on success.
      // We only want it to stop spinning on failure.
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (signatures.length === 0) {
      toast.error('Please add a signature before downloading.');
      return;
    }
    setIsProcessing(true);
    toast.info('Preparing download...');

    try {
      const signedPdfBlob = await applySignaturesToPdf();
      const url = URL.createObjectURL(signedPdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Signed document downloaded!');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download the document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black rounded-lg backdrop-blur-sm'>
      <div className='relative flex h-[95vh] w-[95vw] max-w-6xl flex-col rounded-lg bg-white shadow-2xl'>
        <header className='flex flex-shrink-0 items-center justify-between border-b p-4'>
          <h2 className='text-xl font-bold'>Sign Document: {file.name}</h2>
          <div className='flex items-center gap-5'>
            <Button>Submt Signed Document</Button>
            <button
            onClick={onClose}
            className='rounded-full p-2 text-2xl leading-none hover:bg-gray-200'
          >
            &times;
          </button>
          </div>
        </header>
        <div className='flex flex-grow overflow-hidden rounded-lg'>
          <div
            ref={scrollContainerRef}
            id='pdf-scroll-container'
            className='relative flex-1 overflow-y-auto bg-gray-100 p-4'
            onClick={() => setActiveSignatureId(null)}
          >
            {loadingState === 'preparing' && (
              <div className='bg-opacity-90 absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100'>
                <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
                <p className='mt-4 text-lg text-gray-700'>
                  Preparing Document...
                </p>
              </div>
            )}

            <div className='relative'>
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) =>
                  toast.error(`Error loading PDF: ${error.message}`)
                }
              >
                {Array.from(new Array(numPages ?? 0), (el, index) => (
                  <div
                    key={`page_${index + 1}`}
                    ref={(el) => {
                      if (el) pageRefs.current.set(index + 1, el);
                      else pageRefs.current.delete(index + 1);
                    }}
                    className='relative mb-4 flex justify-center'
                  >
                    <Page pageNumber={index + 1} />
                  </div>
                ))}
              </Document>

              {loadingState !== 'preparing' &&
                signatures.map((sig) => {
                  const isActive = sig.id === activeSignatureId;
                  const pageRef = pageRefs.current.get(sig.page);
                  if (!pageRef) return null;

                  const absolutePosition = {
                    x: pageRef.offsetLeft + sig.x,
                    y: pageRef.offsetTop + sig.y
                  };

                  return (
                    <Rnd
                      key={sig.id}
                      size={{ width: sig.width, height: sig.height }}
                      position={absolutePosition}
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        setActiveSignatureId(sig.id);
                      }}
                      onDragStart={(e, d) => setActiveSignatureId(sig.id)}
                      onDrag={handleDrag}
                      onDragStop={stopScrolling}
                      onResizeStart={stopScrolling}
                      onResizeStop={(
                        e,
                        direction,
                        ref,
                        delta,
                        position: Position
                      ) => {
                        const currentPageRef = pageRefs.current.get(sig.page);
                        if (currentPageRef) {
                          setSignatures((prev) =>
                            prev.map((s) =>
                              s.id === sig.id
                                ? {
                                    ...s,
                                    width: parseInt(ref.style.width),
                                    height: parseInt(ref.style.height),
                                    x: position.x - currentPageRef.offsetLeft,
                                    y: position.y - currentPageRef.offsetTop
                                  }
                                : s
                            )
                          );
                        }
                      }}
                      bounds='#pdf-scroll-container'
                      className={`pointer-events-auto cursor-move ${
                        isActive
                          ? 'border-2 border-dashed border-blue-500'
                          : 'border-2 border-transparent'
                      } transition-opacity duration-200 ${
                        sig.isNew ? 'opacity-0' : 'opacity-100'
                      }`}
                      style={{
                        zIndex: isActive ? 21 : 20,
                        transform: `rotate(${sig.rotation}deg)`
                      }}
                      dragHandleClassName='signature-drag-handle'
                    >
                      <div className='signature-drag-handle h-full w-full'>
                        <img
                          src={sig.dataUrl}
                          alt='Signature'
                          className='h-full w-full'
                        />
                      </div>
                      {isActive && (
                        <div onMouseDown={(e) => e.stopPropagation()}>
                          <div
                            onMouseDown={(e) => handleRotation(sig.id, e)}
                            className='absolute -top-3 -right-3 cursor-alias rounded-full bg-blue-500 p-1 text-white hover:bg-blue-700'
                          >
                            <RotateCcw size={16} />
                          </div>
                        </div>
                      )}
                    </Rnd>
                  );
                })}
            </div>
          </div>
          <aside
            // Add 'relative' to act as a positioning container for the overlay
            className={`relative w-80 flex-shrink-0 border-l bg-gray-50 p-4 transition-opacity duration-300`}
          >
            {/*
              FIX: Add a loading overlay that covers the entire panel.
              This displays while the PDF is loading, preventing laggy drawing
              and providing clear user feedback.
            */}
            {loadingState !== 'ready' && (
              <div className='bg-opacity-80 absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50 backdrop-blur-sm'>
                <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
                <p className='mt-2 font-medium text-gray-600'>
                  {loadingState === 'rendering'
                    ? 'Finalizing UI...'
                    : 'Waiting for document...'}
                </p>
              </div>
            )}

            <div
              // This container will hold all the content and will be disabled
              // if the PDF is still loading.
              className={`transition-opacity duration-300 ${
                loadingState !== 'ready' ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <h3 className='text-lg font-semibold'>Create Your Signature</h3>
              <Tabs
                value={signatureMode}
                onValueChange={(value) =>
                  setSignatureMode(value as 'draw' | 'type' | 'upload')
                }
                className='mt-2 w-full'
              >
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='draw'>Draw</TabsTrigger>
                  <TabsTrigger value='type'>Type</TabsTrigger>
                  <TabsTrigger value='upload'>Upload</TabsTrigger>
                </TabsList>
                <TabsContent value='draw'>
                  <div className='mt-4 rounded-md border-2 border-blue-500'>
                    <SignatureCanvas
                      ref={sigPadRef}
                      penColor='black'
                      canvasProps={{
                        width: 284,
                        height: 150,
                        className: 'sigCanvas'
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value='type'>
                  <div
                    className='mt-4 flex flex-col items-center justify-center rounded-md border-2 border-blue-500 p-4'
                    style={{ height: 154 }}
                  >
                    <Input
                      placeholder='Type your name'
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      className='border-b-2 border-gray-400 text-center text-4xl'
                      style={{ fontFamily: '"Great Vibes", cursive' }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value='upload'>
                  <div
                    className='mt-4 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-400 p-4'
                    style={{ height: 154 }}
                  >
                    <Input
                      type='file'
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept='image/png, image/jpeg'
                      className='hidden'
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant='outline'
                    >
                      <Upload className='mr-2 h-4 w-4' />
                      Import Signature
                    </Button>
                    <p className='mt-2 text-xs text-gray-500'>
                      PNG or JPG file
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              <div className='mt-4 flex gap-2'>
                <Button
                  variant='outline'
                  onClick={clearSignature}
                  disabled={isProcessing}
                >
                  Clear
                </Button>
                {signatureMode !== 'upload' && (
                  <Button
                    onClick={saveAndPlaceSignature}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating...
                      </>
                    ) : (
                      'Create & Add Signature'
                    )}
                  </Button>
                )}
              </div>
              <hr className='my-6' />
              <div className='flex flex-col gap-2'>
                <Button
                  size='lg'
                  onClick={handleDownload}
                  disabled={signatures.length === 0 || isProcessing}
                  className='bg-blue-600 hover:bg-blue-700'
                >
                  {isProcessing ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Download className='mr-2 h-4 w-4' />
                  )}
                  Download Signed
                </Button>
                <Button
                  size='lg'
                  onClick={handleFinalSign}
                  disabled={signatures.length === 0 || isProcessing}
                  className='bg-green-600 hover:bg-green-700'
                >
                  {isProcessing ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : null}
                  Apply & Finalize
                </Button>
                <Button size='lg' variant='destructive' onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
