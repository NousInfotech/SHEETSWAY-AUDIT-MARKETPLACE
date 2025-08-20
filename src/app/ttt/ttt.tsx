// 'use client';

// import React, { useState, useMemo, useRef, useEffect } from 'react';

// import {
//   Folder,
//   File as FileIcon,
//   Trash2,
//   Plus,
//   Search,
//   Download,
//   ExternalLink,
//   Menu,
//   MoreVertical,
//   FileText,
//   Save,
//   Upload,
//   Settings,
//   Library,
//   LayoutList,
//   Check,
//   X
// } from 'lucide-react';
// import { toast } from 'sonner';

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle
// } from '@/components/ui/sheet';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import {
//   getRoots,
//   getRootFolders,
//   getSubFolders,
//   getFiles,
//   createRootFolder,
//   createSubFolder,
//   createFile,
//   renameRootFolder,
//   renameSubFolder,
//   renameFile,
//   deleteRootFolder,
//   deleteSubFolder,
//   deleteFile
// } from '@/api/engagement';
// import { uploadMultipleFiles, getAccessUrlForFile } from '@/lib/aws-s3-utils'; // <-- AWS utilities imported

// // =================================================================================
// // TYPE DEFINITIONS
// // =================================================================================

// type FileData = {
//   id: string;
//   name: string;
//   size: number;
//   creationDate: string;
//   directory: string;
//   url: string; // This will now store the S3 File Key
// };
// type Subfolder = { id: string; name: string; files: FileData[] };
// type LibraryData = { id: string; name: string; subfolders: Subfolder[] };

// const ALL_DOCUMENTS_ID = '__ALL_DOCUMENTS__';
// const CLICK_DELAY = 250; // ms

// // =================================================================================
// // HELPER FUNCTIONS
// // =================================================================================
// function formatBytes(bytes: number, decimals = 2): string {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// }

// // =================================================================================
// // STABLE CHILD COMPONENTS (No changes needed here)
// // =================================================================================

// // #region Sidebar Component
// type SidebarContentProps = {
//   libraries: LibraryData[];
//   selectedLibraryId: string;
//   renamingInfo: { id: string; type: 'library' | 'subfolder' } | null;
//   isAddingLibrary: boolean;
//   newLibraryName: string;
//   renameInputRef: React.RefObject<HTMLInputElement | null>;
//   addLibraryInputRef: React.RefObject<HTMLInputElement | null>;
//   handleLibrarySelect: (id: string) => void;
//   handleSingleClick: (action: () => void) => void;
//   handleDoubleClick: (action: () => void) => void;
//   setRenamingInfo: (
//     info: { id: string; type: 'library' | 'subfolder' } | null
//   ) => void;
//   handleRename: (newName: string) => void;
//   handleRenameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
//   setIsAddingLibrary: (isAdding: boolean) => void;
//   setNewLibraryName: (name: string) => void;
//   handleAddLibraryKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
//   handleConfirmAddLibrary: () => void;
//   handleCancelAddLibrary: () => void;
//   handleInitiateDeleteLibrary: (library: LibraryData) => void;
// };
// const SidebarContent: React.FC<SidebarContentProps> = ({
//   libraries,
//   selectedLibraryId,
//   renamingInfo,
//   isAddingLibrary,
//   newLibraryName,
//   renameInputRef,
//   addLibraryInputRef,
//   handleLibrarySelect,
//   handleSingleClick,
//   handleDoubleClick,
//   setRenamingInfo,
//   handleRename,
//   handleRenameKeyDown,
//   setIsAddingLibrary,
//   setNewLibraryName,
//   handleAddLibraryKeyDown,
//   handleConfirmAddLibrary,
//   handleCancelAddLibrary,
//   handleInitiateDeleteLibrary
// }) => (
//   <div className='flex h-full flex-col not-dark:bg-slate-50'>
//     <div className='border-b p-4'>
//       <h2 className='flex items-center text-xl font-semibold'>
//         <LayoutList className='mr-3 h-6 w-6 text-orange-600' /> Libraries
//       </h2>
//     </div>
//     <nav className='flex-1 space-y-1 overflow-y-auto px-2 py-4'>
//       <button
//         onClick={() => handleLibrarySelect(ALL_DOCUMENTS_ID)}
//         className={`flex w-full items-center rounded-md p-2 text-left text-sm font-medium transition-colors ${selectedLibraryId === ALL_DOCUMENTS_ID ? 'border-l-4 border-orange-500 bg-orange-100 font-bold text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
//       >
//         <Folder className='mr-3 h-5 w-5 flex-shrink-0' /> All Documents
//       </button>
//       <div className='pt-2'></div>
//       {libraries.map((library) => (
//         <div
//           key={library.id}
//           className={`flex w-full cursor-pointer items-center justify-between rounded-md p-2 text-left text-sm font-medium transition-colors ${selectedLibraryId === library.id ? 'border-l-4 border-orange-500 bg-orange-100 font-bold text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
//           onClick={() =>
//             handleSingleClick(() => handleLibrarySelect(library.id))
//           }
//           onDoubleClick={() =>
//             handleDoubleClick(() =>
//               setRenamingInfo({ id: library.id, type: 'library' })
//             )
//           }
//         >
//           {renamingInfo?.id === library.id ? (
//             <Input
//               defaultValue={library.name}
//               ref={renameInputRef as React.RefObject<HTMLInputElement>}
//               onBlur={(e) => handleRename(e.target.value)}
//               onKeyDown={handleRenameKeyDown}
//               className='h-8'
//               onClick={(e) => e.stopPropagation()}
//               onDoubleClick={(e) => e.stopPropagation()}
//             />
//           ) : (
//             <>
//               <span className='flex items-center truncate'>
//                 <Folder className='mr-3 h-5 w-5 flex-shrink-0' />
//                 <span className='truncate'>{library.name}</span>
//               </span>
//               <DropdownMenu>
//                 <DropdownMenuTrigger
//                   asChild
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <Button
//                     variant='ghost'
//                     size='icon'
//                     className='h-6 w-6 flex-shrink-0'
//                   >
//                     <MoreVertical className='h-4 w-4' />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
//                   <DropdownMenuItem
//                     className='text-red-500 focus:bg-red-50 focus:text-red-500'
//                     onClick={() => handleInitiateDeleteLibrary(library)}
//                   >
//                     <Trash2 className='mr-2 h-4 w-4' /> Delete Library
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </>
//           )}
//         </div>
//       ))}
//       {isAddingLibrary ? (
//         <div className='flex items-center gap-2 p-2'>
//           <Input
//             ref={addLibraryInputRef as React.RefObject<HTMLInputElement>}
//             placeholder='New library name...'
//             className='h-8'
//             value={newLibraryName}
//             onChange={(e) => setNewLibraryName(e.target.value)}
//             onKeyDown={handleAddLibraryKeyDown}
//           />
//           <Button
//             variant='ghost'
//             size='icon'
//             className='h-8 w-8 text-green-600 hover:text-green-600'
//             onClick={handleConfirmAddLibrary}
//           >
//             <Check className='h-4 w-4' />
//           </Button>
//           <Button
//             variant='ghost'
//             size='icon'
//             className='h-8 w-8 text-red-600 hover:text-red-600'
//             onClick={handleCancelAddLibrary}
//           >
//             <X className='h-4 w-4' />
//           </Button>
//         </div>
//       ) : (
//         <Button
//           variant='ghost'
//           className='mt-2 w-full justify-start text-gray-600'
//           onClick={() => setIsAddingLibrary(true)}
//         >
//           <Plus className='mr-2 h-4 w-4' /> Add Library
//         </Button>
//       )}
//     </nav>
//     <div className='space-y-2 border-t p-3'>
//       <div className='flex items-center p-2 text-sm font-semibold text-gray-600'>
//         <Settings className='mr-2 h-4 w-4' /> Library Settings
//       </div>
//       <Button
//         variant='ghost'
//         className='w-full justify-start text-gray-600'
//         onClick={() => toast.info('Saving structure...')}
//       >
//         <Save className='mr-2 h-4 w-4' /> Save Library Structure
//       </Button>
//       <Button
//         variant='ghost'
//         className='w-full justify-start text-gray-600'
//         onClick={() => toast.info('Importing structure...')}
//       >
//         <Upload className='mr-2 h-4 w-4' /> Import Library Structure
//       </Button>
//     </div>
//   </div>
// );
// // #endregion

// // #region SubfolderView Component
// type SubfolderViewProps = {
//   filteredSubfolders: Subfolder[];
//   selectedSubfolder: Subfolder | undefined;
//   showAllFilesInLibrary: boolean;
//   renamingInfo: { id: string; type: 'library' | 'subfolder' } | null;
//   renameInputRef: React.RefObject<HTMLInputElement | null>;
//   isAddingSubfolder: boolean;
//   addSubfolderInputRef: React.RefObject<HTMLInputElement | null>;
//   newSubfolderName: string;
//   folderSearchTerm: string;
//   setFolderSearchTerm: (term: string) => void;
//   setShowAllFilesInLibrary: (show: boolean) => void;
//   handleSubfolderSelect: (id: string) => void;
//   handleSingleClick: (action: () => void) => void;
//   handleDoubleClick: (action: () => void) => void;
//   setRenamingInfo: (
//     info: { id: string; type: 'library' | 'subfolder' } | null
//   ) => void;
//   handleRename: (newName: string) => void;
//   handleRenameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
//   handleInitiateAddSubfolder: () => void;
//   setNewSubfolderName: (name: string) => void;
//   handleAddSubfolderKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
//   handleCancelAddSubfolder: () => void;
//   handleInitiateDeleteSubfolder: () => void;
// };
// const SubfolderView: React.FC<SubfolderViewProps> = ({
//   filteredSubfolders,
//   selectedSubfolder,
//   showAllFilesInLibrary,
//   renamingInfo,
//   renameInputRef,
//   isAddingSubfolder,
//   addSubfolderInputRef,
//   newSubfolderName,
//   folderSearchTerm,
//   setFolderSearchTerm,
//   setShowAllFilesInLibrary,
//   handleSubfolderSelect,
//   handleSingleClick,
//   handleDoubleClick,
//   setRenamingInfo,
//   handleRename,
//   handleRenameKeyDown,
//   handleInitiateAddSubfolder,
//   setNewSubfolderName,
//   handleAddSubfolderKeyDown,
//   handleCancelAddSubfolder,
//   handleInitiateDeleteSubfolder
// }) => (
//   <section className='mb-8' aria-labelledby='subfolders-heading'>
//     <div className='mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center'>
//       <div className='flex flex-wrap items-center gap-2'>
//         <Button variant='outline' onClick={handleInitiateAddSubfolder}>
//           <Plus className='mr-2 h-4 w-4' /> Add Folder
//         </Button>
//         <Button
//           variant='outline'
//           onClick={() => setShowAllFilesInLibrary(true)}
//         >
//           <FileText className='mr-2 h-4 w-4' /> Show all documents
//         </Button>
//         <Button
//           variant='outline'
//           onClick={handleInitiateDeleteSubfolder}
//           disabled={!selectedSubfolder}
//         >
//           <Trash2 className='mr-2 h-4 w-4' /> Delete Folder
//         </Button>
//       </div>
//       <div className='relative w-full md:w-64'>
//         <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
//         <Input
//           placeholder='Search folders...'
//           className='pl-10'
//           value={folderSearchTerm}
//           onChange={(e) => setFolderSearchTerm(e.target.value)}
//         />
//       </div>
//     </div>
//     <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
//       {isAddingSubfolder && (
//         <div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 text-center'>
//           <Folder className='mx-auto h-12 w-12 text-gray-400' />
//           <Input
//             ref={addSubfolderInputRef as React.RefObject<HTMLInputElement>}
//             placeholder='New folder name'
//             className='mt-2 h-8'
//             value={newSubfolderName}
//             onChange={(e) => setNewSubfolderName(e.target.value)}
//             onKeyDown={handleAddSubfolderKeyDown}
//             onBlur={handleCancelAddSubfolder}
//           />
//         </div>
//       )}
//       {filteredSubfolders.map((subfolder) => (
//         <div
//           key={subfolder.id}
//           className={`cursor-pointer rounded-lg border p-3 text-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${selectedSubfolder?.id === subfolder.id && !showAllFilesInLibrary ? 'border-b-4 border-b-blue-500 shadow-sm not-dark:bg-blue-100' : 'border-transparent not-dark:bg-gray-100 hover:bg-gray-200'}`}
//           onClick={() =>
//             handleSingleClick(() => handleSubfolderSelect(subfolder.id))
//           }
//           onDoubleClick={() =>
//             handleDoubleClick(() =>
//               setRenamingInfo({ id: subfolder.id, type: 'subfolder' })
//             )
//           }
//         >
//           <img
//             src='/assets/file-icons/open-folder.png'
//             alt={`${subfolder.name} folder`}
//             className={`mx-auto h-12 w-12`}
//           />
//           {renamingInfo?.id === subfolder.id ? (
//             <Input
//               defaultValue={subfolder.name}
//               ref={renameInputRef as React.RefObject<HTMLInputElement>}
//               onBlur={(e) => handleRename(e.target.value)}
//               onKeyDown={handleRenameKeyDown}
//               className='mt-2 h-8'
//               onClick={(e) => e.stopPropagation()}
//               onDoubleClick={(e) => e.stopPropagation()}
//             />
//           ) : (
//             <p className='mt-2 truncate text-sm font-medium text-gray-700'>
//               {subfolder.name}
//             </p>
//           )}
//         </div>
//       ))}
//     </div>
//   </section>
// );
// // #endregion

// // #region FileListView Component
// type FileListViewProps = {
//   heading: string;
//   filteredFiles: FileData[];
//   selectedFiles: string[];
//   canAddDocument: boolean;
//   fileSearchTerm: string;
//   fileInputRef: React.RefObject<HTMLInputElement | null>;
//   handleSelectAllFiles: (checked: boolean) => void;
//   handleFileSelect: (id: string) => void;
//   handleDeleteFiles: () => void;
//   handleInitiateUpload: () => void;
//   handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   handleOpenFileInNewTab: (fileKey: string, fileName: string) => void;
//   handleDownloadFile: (fileKey: string, filename: string) => void;
//   setFileSearchTerm: (term: string) => void;
// };
// const FileListView: React.FC<FileListViewProps> = ({
//   heading,
//   filteredFiles,
//   selectedFiles,
//   canAddDocument,
//   fileSearchTerm,
//   fileInputRef,
//   handleSelectAllFiles,
//   handleFileSelect,
//   handleDeleteFiles,
//   handleInitiateUpload,
//   handleFileUpload,
//   handleOpenFileInNewTab,
//   handleDownloadFile,
//   setFileSearchTerm
// }) => (
//   <section aria-labelledby='files-heading'>
//     <input
//       type='file'
//       ref={fileInputRef as React.RefObject<HTMLInputElement>}
//       onChange={handleFileUpload}
//       multiple
//       hidden
//       accept='.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg'
//     />

//     <h2 id='files-heading' className='mb-5 text-xl font-semibold text-gray-800'>
//       {heading}
//     </h2>
//     <div className='mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center'>
//       <div className='flex flex-wrap items-center gap-2'>
//         <Button
//           variant='outline'
//           onClick={handleInitiateUpload}
//           disabled={!canAddDocument}
//         >
//           <Plus className='mr-2 h-4 w-4' /> Add Document
//         </Button>
//         <Button
//           variant='outline'
//           onClick={handleDeleteFiles}
//           disabled={selectedFiles.length === 0}
//         >
//           <Trash2 className='mr-2 h-4 w-4' /> Delete Files
//         </Button>
//       </div>
//       <div className='relative w-full md:w-64'>
//         <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
//         <Input
//           placeholder='Search files...'
//           className='pl-10'
//           value={fileSearchTerm}
//           onChange={(e) => setFileSearchTerm(e.target.value)}
//         />
//       </div>
//     </div>

//     <div className='overflow-x-auto rounded-lg border'>
//       <Table>
//         <TableHeader className='not-dark:bg-gray-50'>
//           <TableRow>
//             <TableHead className='w-[50px] px-4'>
//               <Checkbox
//                 checked={
//                   selectedFiles.length === filteredFiles.length &&
//                   filteredFiles.length > 0
//                 }
//                 onCheckedChange={(checked) =>
//                   handleSelectAllFiles(Boolean(checked))
//                 }
//                 aria-label='Select all files'
//               />
//             </TableHead>
//             <TableHead className='w-[50px]'>File</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Size</TableHead>
//             <TableHead>Creation Date</TableHead>
//             <TableHead>Directory</TableHead>
//             <TableHead className='pr-4 text-right'>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {filteredFiles.length > 0 ? (
//             filteredFiles.map((file) => (
//               <TableRow key={file.id}>
//                 <TableCell className='px-4'>
//                   <Checkbox
//                     checked={selectedFiles.includes(file.id)}
//                     onCheckedChange={() => handleFileSelect(file.id)}
//                     aria-label={`Select file ${file.name}`}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <FileIcon className='h-5 w-5 text-red-500' />
//                 </TableCell>
//                 <TableCell className='font-medium text-gray-800'>
//                   {file.name}
//                 </TableCell>
//                 <TableCell className='text-gray-600'>
//                   {formatBytes(file.size)}
//                 </TableCell>
//                 <TableCell className='text-gray-600'>
//                   {file.creationDate}
//                 </TableCell>
//                 <TableCell className='text-gray-600'>
//                   {file.directory}
//                 </TableCell>
//                 <TableCell className='pr-4 text-right'>
//                   <div className='flex items-center justify-end gap-1'>
//                     <Button
//                       variant='ghost'
//                       size='icon'
//                       aria-label={`Download ${file.name}`}
//                       onClick={() => handleDownloadFile(file.url, file.name)}
//                     >
//                       <Download className='h-5 w-5' />
//                     </Button>
//                     <Button
//                       variant='ghost'
//                       size='icon'
//                       aria-label={`Open ${file.name} in new tab`}
//                       onClick={() =>
//                         handleOpenFileInNewTab(file.url, file.name)
//                       }
//                     >
//                       <ExternalLink className='h-5 w-5' />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={7} className='h-24 text-center text-gray-500'>
//                 No documents found.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   </section>
// );
// // #endregion

// // =================================================================================
// // MAIN COMPONENT
// // =================================================================================
// export default function FilesandDocuments({ engagement }: any) {
//   const [libraries, setLibraries] = useState<LibraryData[]>([]);
//   const [selectedLibraryId, setSelectedLibraryId] =
//     useState<string>(ALL_DOCUMENTS_ID);
//   const [selectedSubfolderId, setSelectedSubfolderId] = useState<string | null>(
//     null
//   );
//   const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
//   const [folderSearchTerm, setFolderSearchTerm] = useState('');
//   const [fileSearchTerm, setFileSearchTerm] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showAllFilesInLibrary, setShowAllFilesInLibrary] = useState(false);

//   const [renamingInfo, setRenamingInfo] = useState<{
//     id: string;
//     type: 'library' | 'subfolder';
//   } | null>(null);
//   const [isAddingLibrary, setIsAddingLibrary] = useState(false);
//   const [newLibraryName, setNewLibraryName] = useState('');
//   const [isAddingSubfolder, setIsAddingSubfolder] = useState(false);
//   const [newSubfolderName, setNewSubfolderName] = useState('');
//   const [primaryRootId, setPrimaryRootId] = useState<string | null>(null);

//   const renameInputRef = useRef<HTMLInputElement>(null);
//   const addLibraryInputRef = useRef<HTMLInputElement>(null);
//   const addSubfolderInputRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

//   // ***************************************************************************************************************
//   // DATA FETCHING AND STRUCTURING
//   // ***************************************************************************************************************
//   const fetchAndStructureData = async () => {
//     if (!engagement?.id) return;

//     try {
//       const roots = await getRoots(engagement.id);
//       if (!roots || roots.length === 0) {
//         setLibraries([]);
//         return;
//       }
//       setPrimaryRootId(roots[0].id);

//       let allFolders: any[] = [];
//       for (const root of roots) {
//         const foldersForRoot = await getRootFolders(root.id);
//         allFolders.push(...foldersForRoot);
//       }

//       const rootFoldersFromApi = allFolders.filter(
//         (folder) => folder.parentId === null
//       );

//       const libraryPromises = rootFoldersFromApi.map(async (libData) => {
//         const subfoldersFromApi = await getSubFolders(libData.id);

//         const subfolderPromises = subfoldersFromApi.map(
//           async (subData: any) => {
//             const filesFromApi = await getFiles(subData.id);
//             const files: FileData[] = filesFromApi.map((file: any) => ({
//               id: file.id,
//               name: file.name,
//               size: file.size,
//               creationDate: new Date(file.createdAt).toLocaleString(),
//               directory: `${libData.name}/${subData.name}`,
//               url: file.url // url is the S3 file key
//             }));
//             return { id: subData.id, name: subData.name, files };
//           }
//         );

//         const subfolders = await Promise.all(subfolderPromises);
//         return { id: libData.id, name: libData.name, subfolders: subfolders };
//       });

//       const structuredLibraries = await Promise.all(libraryPromises);
//       setLibraries(structuredLibraries);

//       if (
//         structuredLibraries.length > 0 &&
//         selectedLibraryId === ALL_DOCUMENTS_ID
//       ) {
//         const auditProcedures = structuredLibraries.find(
//           (lib) => lib.name === 'Audit Procedures'
//         );
//         if (auditProcedures) {
//           setSelectedLibraryId(auditProcedures.id);
//           if (auditProcedures.subfolders.length > 0) {
//             setSelectedSubfolderId(auditProcedures.subfolders[0].id);
//           }
//         } else {
//           setSelectedLibraryId(structuredLibraries[0].id);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to fetch and structure library data:', error);
//       toast.error('Failed to load document libraries.');
//       setLibraries([]);
//     }
//   };

//   useEffect(() => {
//     fetchAndStructureData();
//   }, [engagement?.id]);

//   // ***************************************************************************************************************

//   useEffect(() => {
//     if (renamingInfo) {
//       renameInputRef.current?.focus();
//       renameInputRef.current?.select();
//     }
//   }, [renamingInfo]);
//   useEffect(() => {
//     if (isAddingLibrary) {
//       addLibraryInputRef.current?.focus();
//     }
//   }, [isAddingLibrary]);
//   useEffect(() => {
//     if (isAddingSubfolder) {
//       addSubfolderInputRef.current?.focus();
//     }
//   }, [isAddingSubfolder]);
//   useEffect(() => {
//     return () => {
//       if (clickTimerRef.current) {
//         clearTimeout(clickTimerRef.current);
//       }
//     };
//   }, []);

//   const handleSingleClick = (action: () => void) => {
//     if (clickTimerRef.current) {
//       clearTimeout(clickTimerRef.current);
//       clickTimerRef.current = null;
//     }
//     clickTimerRef.current = setTimeout(() => {
//       action();
//       clickTimerRef.current = null;
//     }, CLICK_DELAY);
//   };

//   const handleDoubleClick = (renameAction: () => void) => {
//     if (clickTimerRef.current) {
//       clearTimeout(clickTimerRef.current);
//       clickTimerRef.current = null;
//     }
//     renameAction();
//   };

//   const handleLibrarySelect = (libraryId: string) => {
//     if (renamingInfo || isAddingLibrary) return;
//     setSelectedLibraryId(libraryId);
//     setSelectedSubfolderId(null);
//     setShowAllFilesInLibrary(false);
//     setFolderSearchTerm('');
//     setFileSearchTerm('');
//     setSelectedFiles([]);
//     setIsAddingSubfolder(false);
//     if (isSidebarOpen) setIsSidebarOpen(false);
//   };

//   const handleSubfolderSelect = (subfolderId: string) => {
//     if (renamingInfo || isAddingSubfolder) return;
//     setSelectedSubfolderId(subfolderId);
//     setShowAllFilesInLibrary(false);
//     setFileSearchTerm('');
//     setSelectedFiles([]);
//   };

//   const handleConfirmAddLibrary = async () => {
//     const trimmedName = newLibraryName.trim();
//     if (!trimmedName) {
//       toast.error('Library name cannot be empty.');
//       return;
//     }
//     if (!primaryRootId) {
//       toast.error('Cannot create library: primary root not found.');
//       return;
//     }
//     try {
//       await createRootFolder(primaryRootId, { name: trimmedName });
//       toast.success(`Library "${trimmedName}" created.`);
//       await fetchAndStructureData();
//     } catch (error) {
//       toast.error('Failed to create library.');
//       console.error(error);
//     } finally {
//       handleCancelAddLibrary();
//     }
//   };

//   const handleCancelAddLibrary = () => {
//     setNewLibraryName('');
//     setIsAddingLibrary(false);
//   };
//   const handleAddLibraryKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === 'Enter') handleConfirmAddLibrary();
//     if (e.key === 'Escape') handleCancelAddLibrary();
//   };

//   const handleInitiateAddSubfolder = () => {
//     if (!selectedLibrary) {
//       toast.error('Please select a library first.');
//       return;
//     }
//     setIsAddingSubfolder(true);
//   };

//   const handleConfirmAddSubfolder = async () => {
//     const trimmedName = newSubfolderName.trim();
//     if (!trimmedName || !selectedLibraryId) {
//       handleCancelAddSubfolder();
//       return;
//     }
//     try {
//       await createSubFolder(selectedLibraryId, { name: trimmedName });
//       toast.success(`Folder "${trimmedName}" created.`);
//       await fetchAndStructureData();
//     } catch (error) {
//       toast.error('Failed to create folder.');
//       console.error(error);
//     } finally {
//       handleCancelAddSubfolder();
//     }
//   };

//   const handleCancelAddSubfolder = () => {
//     setNewSubfolderName('');
//     setIsAddingSubfolder(false);
//   };
//   const handleAddSubfolderKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === 'Enter') handleConfirmAddSubfolder();
//     if (e.key === 'Escape') handleCancelAddSubfolder();
//   };

//   const handleInitiateUpload = () => {
//     if (!selectedSubfolder) {
//       toast.error('Please select a subfolder to add a document.');
//       return;
//     }
//     fileInputRef.current?.click();
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0 || !selectedSubfolderId) {
//       if (e.target) e.target.value = '';
//       return;
//     }

//     const folderName = `${selectedLibrary?.name}/${selectedSubfolder?.name}`;
//     const uploadToast = toast.loading(`Uploading ${files.length} file(s)...`);

//     try {
//       // 1. Upload files to AWS S3
//       const uploadedFilesInfo = await uploadMultipleFiles(
//         Array.from(files),
//         folderName
//       );

//       // 2. Create file records in the database
//       const createFilePromises = uploadedFilesInfo.map((info, index) => {
//         const originalFile = files[index];
//         const formData = new FormData();
//         formData.append('name', originalFile.name);
//         formData.append('url', info.fileKey); // Send S3 file key to backend
//         formData.append('size', originalFile.size.toString());
//         return createFile(selectedSubfolderId, formData);
//       });

//       await Promise.all(createFilePromises);
//       toast.success(`Successfully uploaded ${files.length} file(s).`, {
//         id: uploadToast
//       });
//       await fetchAndStructureData(); // Refresh data
//     } catch (error) {
//       toast.error('File upload failed. Please try again.', {
//         id: uploadToast
//       });
//       console.error('Upload process failed:', error);
//     } finally {
//       if (e.target) e.target.value = ''; // Reset file input
//     }
//   };

//   const handleOpenFileInNewTab = async (fileKey: string, fileName: string) => {
//     const openToast = toast.loading('Generating secure link...');
//     try {
//       // The 'url' parameter from FileData is the fileKey
//       const accessUrl = await getAccessUrlForFile(fileKey);
//       toast.success('Link generated!', { id: openToast });
//       const viewerUrl = `/view-document?fileUrl=${encodeURIComponent(accessUrl)}&fileName=${encodeURIComponent(fileName)}`;
//       window.open(viewerUrl, '_blank', 'noopener,noreferrer');
//     } catch (error) {
//       toast.error('Could not open file. Please try again.', { id: openToast });
//       console.error('Failed to get access URL:', error);
//     }
//   };

//   const handleDownloadFile = async (fileKey: string, filename: string) => {
//     const downloadToast = toast.loading('Preparing download...');
//     try {
//       // The 'url' parameter from FileData is the fileKey
//       const accessUrl = await getAccessUrlForFile(fileKey);

//       const response = await fetch(accessUrl);
//       if (!response.ok) throw new Error('Network response was not ok.');
//       const blob = await response.blob();
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(downloadUrl);
//       toast.success('Download started.', { id: downloadToast });
//     } catch (error) {
//       toast.error('Failed to download file.', { id: downloadToast });
//       console.error('Download error:', error);
//     }
//   };

//   const handleRename = async (newName: string) => {
//     if (!renamingInfo || !newName.trim()) {
//       setRenamingInfo(null);
//       return;
//     }
//     const { id, type } = renamingInfo;

//     try {
//       if (type === 'library') {
//         await renameRootFolder(id, { name: newName });
//       } else {
//         await renameSubFolder(id, { name: newName });
//       }
//       toast.success(
//         `${type === 'library' ? 'Library' : 'Folder'} renamed to "${newName}"`
//       );
//       await fetchAndStructureData(); // Refetch to get updated names
//     } catch (error) {
//       toast.error(`Failed to rename ${type}.`);
//       console.error(error);
//     } finally {
//       setRenamingInfo(null);
//     }
//   };

//   const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') handleRename(e.currentTarget.value);
//     if (e.key === 'Escape') setRenamingInfo(null);
//   };

//   const handleFileSelect = (fileId: string) => {
//     setSelectedFiles((prev) =>
//       prev.includes(fileId)
//         ? prev.filter((id) => id !== fileId)
//         : [...prev, fileId]
//     );
//   };

//   const confirmDeleteLibrary = async (libraryIdToDelete: string) => {
//     try {
//       await deleteRootFolder(libraryIdToDelete);
//       toast.success('Library has been deleted.');
//       if (selectedLibraryId === libraryIdToDelete) {
//         handleLibrarySelect(ALL_DOCUMENTS_ID);
//       }
//       await fetchAndStructureData();
//     } catch (error) {
//       toast.error('Failed to delete library.');
//       console.error(error);
//     }
//   };

//   const handleInitiateDeleteLibrary = (library: LibraryData) => {
//     toast.error(`Are you sure you want to delete "${library.name}"?`, {
//       action: {
//         label: 'Confirm',
//         onClick: () => confirmDeleteLibrary(library.id)
//       }
//     });
//   };

//   const confirmDeleteSubfolder = async () => {
//     if (!selectedLibraryId || !selectedSubfolderId) return;
//     try {
//       await deleteSubFolder(selectedSubfolderId);
//       toast.success('Folder has been deleted.');
//       setSelectedSubfolderId(null);
//       await fetchAndStructureData();
//     } catch (error) {
//       toast.error('Failed to delete folder.');
//       console.error(error);
//     }
//   };

//   const handleInitiateDeleteSubfolder = () => {
//     const subfolder = selectedLibrary?.subfolders.find(
//       (s) => s.id === selectedSubfolderId
//     );
//     if (!subfolder) return;

//     toast.error(`Are you sure you want to delete "${subfolder.name}"?`, {
//       action: { label: 'Confirm', onClick: () => confirmDeleteSubfolder() }
//     });
//   };

//   const handleDeleteFiles = async () => {
//     if (selectedFiles.length === 0) return;

//     try {
//       await Promise.all(selectedFiles.map((id) => deleteFile(id)));
//       toast.success(`${selectedFiles.length} file(s) have been deleted.`);
//       await fetchAndStructureData();
//       setSelectedFiles([]);
//     } catch (error) {
//       toast.error('Failed to delete files.');
//       console.error(error);
//     }
//   };

//   const selectedLibrary = useMemo(
//     () => libraries.find((lib) => lib.id === selectedLibraryId),
//     [libraries, selectedLibraryId]
//   );
//   const allFilesInSystem = useMemo(
//     () =>
//       libraries.flatMap((lib) => lib.subfolders.flatMap((sub) => sub.files)),
//     [libraries]
//   );
//   const allFilesInSelectedLibrary = useMemo(
//     () => selectedLibrary?.subfolders.flatMap((sub) => sub.files) || [],
//     [selectedLibrary]
//   );
//   const selectedSubfolder = useMemo(
//     () =>
//       selectedLibrary?.subfolders.find((sub) => sub.id === selectedSubfolderId),
//     [selectedLibrary, selectedSubfolderId]
//   );
//   const filesForCurrentView = useMemo(() => {
//     if (selectedLibraryId === ALL_DOCUMENTS_ID) return allFilesInSystem;
//     if (showAllFilesInLibrary) return allFilesInSelectedLibrary;
//     if (selectedSubfolder) return selectedSubfolder.files;
//     return [];
//   }, [
//     selectedLibraryId,
//     showAllFilesInLibrary,
//     selectedSubfolder,
//     allFilesInSystem,
//     allFilesInSelectedLibrary
//   ]);
//   const filteredFiles = useMemo(
//     () =>
//       filesForCurrentView.filter((file) => {
//         // Defensive check: ensure the file object and its name property are valid
//         if (!file || typeof file.name !== 'string') {
//           return false; // Exclude invalid items from the result
//         }
//         return file.name.toLowerCase().includes(fileSearchTerm.toLowerCase());
//       }),
//     [filesForCurrentView, fileSearchTerm]
//   );
//   const handleSelectAllFiles = (isChecked: boolean) =>
//     setSelectedFiles(isChecked ? filteredFiles.map((file) => file.id) : []);
//   const filteredSubfolders = useMemo(
//     () =>
//       selectedLibrary?.subfolders.filter((subfolder) =>
//         subfolder.name.toLowerCase().includes(folderSearchTerm.toLowerCase())
//       ) || [],
//     [selectedLibrary, folderSearchTerm]
//   );

//   const sidebarProps = {
//     libraries,
//     selectedLibraryId,
//     renamingInfo,
//     isAddingLibrary,
//     newLibraryName,
//     renameInputRef,
//     addLibraryInputRef,
//     handleLibrarySelect,
//     handleSingleClick,
//     handleDoubleClick,
//     setRenamingInfo,
//     handleRename,
//     handleRenameKeyDown,
//     setIsAddingLibrary,
//     setNewLibraryName,
//     handleAddLibraryKeyDown,
//     handleConfirmAddLibrary,
//     handleCancelAddLibrary,
//     handleInitiateDeleteLibrary
//   };
//   const subfolderViewProps = {
//     filteredSubfolders,
//     selectedSubfolder,
//     showAllFilesInLibrary,
//     renamingInfo,
//     renameInputRef,
//     isAddingSubfolder,
//     addSubfolderInputRef,
//     newSubfolderName,
//     folderSearchTerm,
//     setFolderSearchTerm,
//     setShowAllFilesInLibrary,
//     handleSubfolderSelect,
//     handleSingleClick,
//     handleDoubleClick,
//     setRenamingInfo,
//     handleRename,
//     handleRenameKeyDown,
//     handleInitiateAddSubfolder,
//     setNewSubfolderName,
//     handleAddSubfolderKeyDown,
//     handleCancelAddSubfolder,
//     handleInitiateDeleteSubfolder
//   };

//   let fileListHeading = 'Files';
//   if (selectedLibraryId === ALL_DOCUMENTS_ID)
//     fileListHeading = 'All Documents in System';
//   else if (showAllFilesInLibrary)
//     fileListHeading = `All Files in ${selectedLibrary?.name}`;
//   else if (selectedSubfolder) fileListHeading = selectedSubfolder.name;
//   const fileListViewProps = {
//     heading: fileListHeading,
//     filteredFiles,
//     selectedFiles,
//     canAddDocument: !!selectedSubfolder && !showAllFilesInLibrary,
//     fileSearchTerm,
//     fileInputRef,
//     handleSelectAllFiles,
//     handleFileSelect,
//     handleDeleteFiles,
//     handleInitiateUpload,
//     handleFileUpload,
//     handleOpenFileInNewTab,
//     handleDownloadFile,
//     setFileSearchTerm
//   };

//   return (
//     <div className='flex h-auto font-sans not-dark:bg-white'>
//       <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
//         <SheetContent side='left' className='w-80 p-0 md:hidden'>
//           <SheetHeader>
//             <SheetTitle className='sr-only'>Libraries</SheetTitle>
//           </SheetHeader>
//           <SidebarContent {...sidebarProps} />
//         </SheetContent>
//       </Sheet>
//       <aside className='hidden md:flex md:w-80 md:flex-col md:border-r'>
//         <SidebarContent {...sidebarProps} />
//       </aside>
//       <main className='flex flex-1 flex-col overflow-y-auto p-4 md:p-6'>
//         <header className='mb-6 flex items-center justify-between'>
//           <h1 className='truncate pr-4 text-2xl font-bold text-gray-800'>
//             {(selectedLibraryId === ALL_DOCUMENTS_ID
//               ? 'All Documents'
//               : selectedLibrary?.name) || 'Select a Library'}
//           </h1>
//           <div className='md:hidden'>
//             <Button
//               variant='outline'
//               size='icon'
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu className='h-6 w-6' />
//             </Button>
//           </div>
//         </header>
//         {selectedLibraryId !== ALL_DOCUMENTS_ID && (
//           <SubfolderView {...subfolderViewProps} />
//         )}
//         {(selectedSubfolder ||
//           showAllFilesInLibrary ||
//           selectedLibraryId === ALL_DOCUMENTS_ID) && (
//           <FileListView {...fileListViewProps} />
//         )}
//       </main>
//     </div>
//   );
// }
