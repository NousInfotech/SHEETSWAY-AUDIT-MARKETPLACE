// 'use client';

// import React, {
//   useState,
//   useMemo,
//   useRef,
//   useEffect,
//   useCallback
// } from 'react';

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
//   X,
//   Loader2
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
// import { uploadMultipleFiles, getAccessUrlForFile } from '@/lib/aws-s3-utils';

// // =================================================================================
// // TYPE DEFINITIONS (Updated for lazy loading)
// // =================================================================================

// type FileData = {
//   id: string;
//   name: string;
//   size: number;
//   creationDate: string;
//   directory: string;
//   url: string; // S3 File Key
// };
// // These types are simplified as they no longer hold nested data by default
// type Subfolder = { id: string; name: string };
// type Library = { id: string; name: string };

// const ALL_DOCUMENTS_ID = '__ALL_DOCUMENTS__';
// const CLICK_DELAY = 250;

// // =================================================================================
// // HELPER FUNCTIONS (Unchanged)
// // =================================================================================

// const getMimeType = (fileName: string): string => {
//   const extension = fileName.split('.').pop()?.toLowerCase();
//   switch (extension) {
//     case 'pdf':
//       return 'application/pdf';
//     case 'doc':
//       return 'application/msword';
//     case 'docx':
//       return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
//     case 'jpg':
//     case 'jpeg':
//       return 'image/jpeg';
//     case 'png':
//       return 'image/png';
//     case 'txt':
//       return 'text/plain';
//     // Add other common types as needed
//     default:
//       return 'application/octet-stream'; // A generic fallback
//   }
// };

// function formatBytes(bytes: number, decimals = 2): string {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// }

// // =================================================================================
// // STABLE CHILD COMPONENTS (No changes needed)
// // =================================================================================

// // #region Sidebar Component
// type SidebarContentProps = {
//   libraries: Library[];
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
//   handleInitiateDeleteLibrary: (library: Library) => void;
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
//           {renamingInfo?.id === library.id &&
//           renamingInfo.type === 'library' ? (
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
//   selectedSubfolderId: string | null;
//   renamingInfo: { id: string; type: 'library' | 'subfolder' } | null;
//   renameInputRef: React.RefObject<HTMLInputElement | null>;
//   isAddingSubfolder: boolean;
//   addSubfolderInputRef: React.RefObject<HTMLInputElement | null>;
//   newSubfolderName: string;
//   folderSearchTerm: string;
//   setFolderSearchTerm: (term: string) => void;
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
//   selectedSubfolderId,
//   renamingInfo,
//   renameInputRef,
//   isAddingSubfolder,
//   addSubfolderInputRef,
//   newSubfolderName,
//   folderSearchTerm,
//   setFolderSearchTerm,
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
//           onClick={handleInitiateDeleteSubfolder}
//           disabled={!selectedSubfolderId}
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
//           className={`cursor-pointer rounded-lg border p-3 text-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${selectedSubfolderId === subfolder.id ? 'border-b-4 border-b-blue-500 shadow-sm not-dark:bg-blue-100' : 'border-transparent not-dark:bg-gray-100 hover:bg-gray-200'}`}
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
//           {renamingInfo?.id === subfolder.id &&
//           renamingInfo.type === 'subfolder' ? (
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
//             {/* <TableHead>Size</TableHead> */}
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
//                 {/* <TableCell className='text-gray-600'>
//                   {formatBytes(file.size)}
//                 </TableCell> */}
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
// // MAIN COMPONENT (Refactored for Performance)
// // =================================================================================
// export default function FilesandDocuments({ engagement }: any) {
//   // --- STATE MANAGEMENT (Decoupled for lazy loading) ---
//   const [libraries, setLibraries] = useState<Library[]>([]);
//   const [subfolders, setSubfolders] = useState<Subfolder[]>([]);
//   const [files, setFiles] = useState<FileData[]>([]);

//   const [isLibrariesLoading, setIsLibrariesLoading] = useState(true);
//   const [isSubfoldersLoading, setIsSubfoldersLoading] = useState(false);
//   const [isFilesLoading, setIsFilesLoading] = useState(false);

//   const [selectedLibraryId, setSelectedLibraryId] =
//     useState<string>(ALL_DOCUMENTS_ID);
//   const [selectedSubfolderId, setSelectedSubfolderId] = useState<string | null>(
//     null
//   );

//   // Other UI state
//   const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
//   const [folderSearchTerm, setFolderSearchTerm] = useState('');
//   const [fileSearchTerm, setFileSearchTerm] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [renamingInfo, setRenamingInfo] = useState<{
//     id: string;
//     type: 'library' | 'subfolder';
//   } | null>(null);
//   const [isAddingLibrary, setIsAddingLibrary] = useState(false);
//   const [newLibraryName, setNewLibraryName] = useState('');
//   const [isAddingSubfolder, setIsAddingSubfolder] = useState(false);
//   const [newSubfolderName, setNewSubfolderName] = useState('');
//   const [primaryRootId, setPrimaryRootId] = useState<string | null>(null);

//   // Refs
//   const renameInputRef = useRef<HTMLInputElement>(null);
//   const addLibraryInputRef = useRef<HTMLInputElement>(null);
//   const addSubfolderInputRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

//   // --- DATA FETCHING (Lazy Loading Implementation) ---

//   const fetchLibraries = useCallback(async () => {
//     if (!engagement?.id) return;
//     setIsLibrariesLoading(true);
//     try {
//       const roots = await getRoots(engagement.id);
//       if (!roots || roots.length === 0) {
//         setLibraries([]);
//         return;
//       }
//       setPrimaryRootId(roots[0].id);

//       let allRootFolders: any[] = [];
//       for (const root of roots) {
//         const foldersForRoot = await getRootFolders(root.id);
//         allRootFolders.push(
//           ...foldersForRoot.filter((f: any) => f.parentId === null)
//         );
//       }
//       setLibraries(allRootFolders);

//       // Default selection logic
//       if (selectedLibraryId === ALL_DOCUMENTS_ID) {
//         const auditProcedures = allRootFolders.find(
//           (lib) => lib.name === 'Audit Procedures'
//         );
//         if (auditProcedures) {
//           setSelectedLibraryId(auditProcedures.id);
//         } else if (allRootFolders.length > 0) {
//           setSelectedLibraryId(allRootFolders[0].id);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to fetch libraries:', error);
//       toast.error('Failed to load document libraries.');
//     } finally {
//       setIsLibrariesLoading(false);
//     }
//   }, [engagement?.id, selectedLibraryId]);

//   const fetchSubfolders = useCallback(async (libraryId: string) => {
//     if (!libraryId || libraryId === ALL_DOCUMENTS_ID) return;
//     setIsSubfoldersLoading(true);
//     setSubfolders([]);
//     try {
//       const subfoldersFromApi = await getSubFolders(libraryId);
//       setSubfolders(subfoldersFromApi);
//     } catch (error) {
//       console.error('Failed to fetch subfolders:', error);
//       toast.error('Failed to load folders for this library.');
//     } finally {
//       setIsSubfoldersLoading(false);
//     }
//   }, []);

//   const fetchFiles = useCallback(
//     async (subfolderId: string) => {
//       if (!subfolderId) return;
//       setIsFilesLoading(true);
//       setFiles([]);

//       const currentLibrary = libraries.find(
//         (lib) => lib.id === selectedLibraryId
//       );
//       const currentSubfolder = subfolders.find((sub) => sub.id === subfolderId);
//       if (!currentLibrary || !currentSubfolder) {
//         setIsFilesLoading(false);
//         return;
//       }

//       try {
//         const filesFromApi = await getFiles(subfolderId);
//         const formattedFiles: FileData[] = filesFromApi.map((file: any) => ({
//           id: file.id,
//           name: file.fileName,
//           size: file.size,
//           creationDate: new Date(file.uploadedAt).toLocaleString(),
//           directory: `${currentLibrary.name}/${currentSubfolder.name}`,
//           url: file.fileUrl
//         }));
//         setFiles(formattedFiles);
//       } catch (error) {
//         console.error('Failed to fetch files:', error);
//         toast.error('Failed to load documents for this folder.');
//       } finally {
//         setIsFilesLoading(false);
//       }
//     },
//     [libraries, subfolders, selectedLibraryId]
//   );

//   // --- USEEFFECT HOOKS FOR ORCHESTRATION ---

//   useEffect(() => {
//     fetchLibraries();
//   }, [fetchLibraries]);

//   useEffect(() => {
//     // When library selection changes, clear downstream state and fetch new subfolders.
//     setSelectedSubfolderId(null);
//     setFiles([]);
//     setSubfolders([]);
//     fetchSubfolders(selectedLibraryId);
//   }, [selectedLibraryId, fetchSubfolders]);

//   useEffect(() => {
//     // When subfolder selection changes, clear files and fetch new ones.
//     setFiles([]);
//     fetchFiles(selectedSubfolderId!);
//   }, [selectedSubfolderId, fetchFiles]);

//   // --- UI INTERACTION HANDLERS ---

//   useEffect(() => {
//     if (renamingInfo) {
//       renameInputRef.current?.focus();
//       renameInputRef.current?.select();
//     }
//   }, [renamingInfo]);

//   useEffect(() => {
//     if (isAddingLibrary) addLibraryInputRef.current?.focus();
//   }, [isAddingLibrary]);

//   useEffect(() => {
//     if (isAddingSubfolder) addSubfolderInputRef.current?.focus();
//   }, [isAddingSubfolder]);

//   useEffect(() => {
//     return () => {
//       if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
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

//   // --- CRUD and STATE CHANGE HANDLERS ---

//   const handleLibrarySelect = (libraryId: string) => {
//     if (renamingInfo || isAddingLibrary) return;
//     setSelectedLibraryId(libraryId);
//     if (isSidebarOpen) setIsSidebarOpen(false);
//   };

//   const handleSubfolderSelect = (subfolderId: string) => {
//     if (renamingInfo || isAddingSubfolder) return;
//     setSelectedSubfolderId(subfolderId);
//   };

//   const handleConfirmAddLibrary = async () => {
//     const trimmedName = newLibraryName.trim();
//     if (!trimmedName || !primaryRootId) return;
//     try {
//       await createRootFolder({ rootId: primaryRootId, name: trimmedName });
//       toast.success(`Library "${trimmedName}" created.`);
//       await fetchLibraries();
//     } catch (error) {
//       toast.error('Failed to create library.');
//     } finally {
//       setNewLibraryName('');
//       setIsAddingLibrary(false);
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
//     if (selectedLibraryId === ALL_DOCUMENTS_ID) {
//       toast.error('Please select a library first.');
//       return;
//     }
//     setIsAddingSubfolder(true);
//   };

//   const handleConfirmAddSubfolder = async () => {
//     const trimmedName = newSubfolderName.trim();
//     if (!trimmedName || !selectedLibraryId) return;
//     try {
//       await createSubFolder({ parentId: selectedLibraryId, name: trimmedName });
//       toast.success(`Folder "${trimmedName}" created.`);
//       await fetchSubfolders(selectedLibraryId); // Only refetch subfolders
//     } catch (error) {
//       toast.error('Failed to create folder.');
//     } finally {
//       setNewSubfolderName('');
//       setIsAddingSubfolder(false);
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
//     if (!selectedSubfolderId) {
//       toast.error('Please select a subfolder to add a document.');
//       return;
//     }
//     fileInputRef.current?.click();
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = e.target.files;
//     if (!selectedFiles || selectedFiles.length === 0 || !selectedSubfolderId) {
//       if (e.target) e.target.value = '';
//       return;
//     }

//     const currentLibrary = libraries.find(
//       (lib) => lib.id === selectedLibraryId
//     );
//     const currentSubfolder = subfolders.find(
//       (sub) => sub.id === selectedSubfolderId
//     );
//     if (!currentLibrary || !currentSubfolder) {
//       toast.error('Could not find destination folder.');
//       return;
//     }

//     const folderName = `${currentLibrary.name}/${currentSubfolder.name}`;
//     const uploadToast = toast.loading(
//       `Uploading ${selectedFiles.length} file(s)...`
//     );

//     try {
//       const uploadedFilesInfo = await uploadMultipleFiles(
//         Array.from(selectedFiles),
//         folderName
//       );
//       toast.info('Saving file records...', { id: uploadToast });

//       const createFilePromises = uploadedFilesInfo.map((s3Info, index) => {
//         const originalFile = selectedFiles[index];
//         const payload = {
//           folderId: selectedSubfolderId,
//           fileName: originalFile.name,
//           fileUrl: s3Info.fileKey,
//           size: originalFile.size
//         };
//         return createFile(payload);
//       });

//       await Promise.all(createFilePromises);
//       toast.success(
//         `Successfully uploaded and saved ${selectedFiles.length} file(s).`,
//         { id: uploadToast }
//       );
//       await fetchFiles(selectedSubfolderId); // Only refetch files
//     } catch (error) {
//       toast.error('File upload failed.', { id: uploadToast });
//       console.error('Upload process failed:', error);
//     } finally {
//       if (e.target) e.target.value = '';
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
//         await fetchLibraries();
//       } else {
//         await renameSubFolder(id, { name: newName });
//         await fetchSubfolders(selectedLibraryId);
//       }
//       toast.success(`${type === 'library' ? 'Library' : 'Folder'} renamed.`);
//     } catch (error) {
//       toast.error(`Failed to rename ${type}.`);
//     } finally {
//       setRenamingInfo(null);
//     }
//   };

//   const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') handleRename(e.currentTarget.value);
//     if (e.key === 'Escape') setRenamingInfo(null);
//   };

//   const handleInitiateDeleteLibrary = (library: Library) => {
//     toast.error(`Are you sure you want to delete "${library.name}"?`, {
//       action: {
//         label: 'Confirm',
//         onClick: async () => {
//           try {
//             await deleteRootFolder(library.id);
//             toast.success('Library deleted.');
//             if (selectedLibraryId === library.id)
//               setSelectedLibraryId(ALL_DOCUMENTS_ID);
//             await fetchLibraries();
//           } catch (error) {
//             toast.error('Failed to delete library.');
//           }
//         }
//       }
//     });
//   };

//   const handleInitiateDeleteSubfolder = () => {
//     const subfolder = subfolders.find((s) => s.id === selectedSubfolderId);
//     if (!subfolder) return;
//     toast.error(`Are you sure you want to delete "${subfolder.name}"?`, {
//       action: {
//         label: 'Confirm',
//         onClick: async () => {
//           try {
//             await deleteSubFolder(subfolder.id);
//             toast.success('Folder deleted.');
//             setSelectedSubfolderId(null);
//             await fetchSubfolders(selectedLibraryId);
//           } catch (error) {
//             toast.error('Failed to delete folder.');
//           }
//         }
//       }
//     });
//   };

//   const handleDeleteFiles = async () => {
//     if (selectedFiles.length === 0 || !selectedSubfolderId) return;
//     const deleteToast = toast.loading(
//       `Deleting ${selectedFiles.length} file(s)...`
//     );
//     try {
//       await Promise.all(selectedFiles.map((id) => deleteFile(id)));
//       toast.success(`${selectedFiles.length} file(s) deleted.`, {
//         id: deleteToast
//       });
//       setSelectedFiles([]);
//       await fetchFiles(selectedSubfolderId);
//     } catch (error) {
//       toast.error('Failed to delete files.', { id: deleteToast });
//     }
//   };

//   const handleFileSelect = (fileId: string) => {
//     setSelectedFiles((prev) =>
//       prev.includes(fileId)
//         ? prev.filter((id) => id !== fileId)
//         : [...prev, fileId]
//     );
//   };

//   const handleOpenFileInNewTab = (fileKey: string, fileName: string) => {
//     // No async/await or toasts are needed here anymore. It's a direct navigation.

//     // 1. Get the file's MIME type from its name.
//     const fileType = getMimeType(fileName);

//     // 2. Construct the URL for your viewer page.
//     //    All these parameters are simple strings and are safe to encode.
//     const viewerUrl = `/view-document?fileKey=${encodeURIComponent(fileKey)}&fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}`;

//     // 3. Open the viewer in a new tab.
//     window.open(viewerUrl, '_blank', 'noopener,noreferrer');
//   };

//   const handleDownloadFile = async (fileKey: string, filename: string) => {
//     const downloadToast = toast.loading('Preparing download...');
//     try {
//       const accessUrl = await getAccessUrlForFile(fileKey);
//       const response = await fetch(accessUrl);
//       if (!response.ok) throw new Error('Network response was not ok.');
//       const blob = await response.blob();
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = downloadUrl;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(downloadUrl);
//       toast.success('Download started.', { id: downloadToast });
//     } catch (error) {
//       toast.error('Failed to download file.', { id: downloadToast });
//     }
//   };

//   // --- MEMOIZED VALUES ---

//   const selectedLibrary = useMemo(
//     () => libraries.find((lib) => lib.id === selectedLibraryId),
//     [libraries, selectedLibraryId]
//   );

//   const filteredSubfolders = useMemo(
//     () =>
//       subfolders.filter((subfolder) =>
//         subfolder.name.toLowerCase().includes(folderSearchTerm.toLowerCase())
//       ),
//     [subfolders, folderSearchTerm]
//   );

//   const filteredFiles = useMemo(
//     () =>
//       files.filter((file) =>
//         file.name.toLowerCase().includes(fileSearchTerm.toLowerCase())
//       ),
//     [files, fileSearchTerm]
//   );

//   const handleSelectAllFiles = (isChecked: boolean) =>
//     setSelectedFiles(isChecked ? filteredFiles.map((file) => file.id) : []);

//   // --- PROPS FOR CHILD COMPONENTS ---

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
//     selectedSubfolderId,
//     renamingInfo,
//     renameInputRef,
//     isAddingSubfolder,
//     addSubfolderInputRef,
//     newSubfolderName,
//     folderSearchTerm,
//     setFolderSearchTerm,
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

//   const fileListViewProps = {
//     heading:
//       subfolders.find((s) => s.id === selectedSubfolderId)?.name || 'Files',
//     filteredFiles,
//     selectedFiles,
//     canAddDocument: !!selectedSubfolderId,
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

//   // --- RENDER LOGIC ---

//   // if (isLibrariesLoading) {
//   //   return (
//   //     <div className='flex h-[50vh] items-center justify-center p-10'>
//   //       <div className='h-8 w-8 animate-spin rounded-full border-4 border-dashed border-amber-500'></div>
//   //     </div>
//   //   );
//   // }

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

//         {selectedLibraryId !== ALL_DOCUMENTS_ID &&
//           (isSubfoldersLoading ? (
//             <div className='flex h-48 items-center justify-center'>
//               <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
//               <span className='ml-2 text-gray-600'>Loading Folders...</span>
//             </div>
//           ) : (
//             <SubfolderView {...subfolderViewProps} />
//           ))}

//         {selectedSubfolderId &&
//           (isFilesLoading ? (
//             <div className='flex h-48 items-center justify-center'>
//               <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
//               <span className='ml-2 text-gray-600'>Loading Documents...</span>
//             </div>
//           ) : (
//             <FileListView {...fileListViewProps} />
//           ))}
//       </main>
//     </div>
//   );
// }

// ###############################################################################################################

'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback
} from 'react';

import dynamic from 'next/dynamic';

import {
  Folder,
  File as FileIcon,
  Trash2,
  Plus,
  Search,
  Download,
  ExternalLink,
  Menu,
  MoreVertical,
  FileText,
  Save,
  Upload,
  Settings,
  Library,
  LayoutList,
  Check,
  X,
  Loader2,
  Scissors,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  getRoots,
  getRootFolders,
  getSubFolders,
  getFiles,
  createRootFolder,
  createSubFolder,
  createFile,
  renameRootFolder,
  renameSubFolder,
  renameFile,
  deleteRootFolder,
  deleteSubFolder,
  deleteFile
} from '@/api/engagement';
import { uploadMultipleFiles, getAccessUrlForFile } from '@/lib/aws-s3-utils';
// 2. DYNAMICALLY IMPORT THE MODAL COMPONENT
const PdfToolsModal = dynamic(
  () =>
    import('@/features/engagements/components/PdfToolsModal').then(
      (mod) => mod.PdfToolsModal
    ),
  {
    ssr: false,
    loading: () => (
      <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
        <Loader2 className='h-8 w-8 animate-spin text-white' />
      </div>
    )
  }
);

// =================================================================================
// TYPE DEFINITIONS (Updated for lazy loading)
// =================================================================================

type FileData = {
  id: string;
  name: string;
  size: number;
  creationDate: string;
  directory: string;
  url: string; // S3 File Key
};
// These types are simplified as they no longer hold nested data by default
type Subfolder = { id: string; name: string };
type Library = { id: string; name: string };

const ALL_DOCUMENTS_ID = '__ALL_DOCUMENTS__';
const CLICK_DELAY = 250;

// =================================================================================
// HELPER FUNCTIONS (Unchanged)
// =================================================================================

const getMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'txt':
      return 'text/plain';
    // Add other common types as needed
    default:
      return 'application/octet-stream'; // A generic fallback
  }
};

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// =================================================================================
// STABLE CHILD COMPONENTS (No changes needed)
// =================================================================================

// #region Sidebar Component
type SidebarContentProps = {
  libraries: Library[];
  selectedLibraryId: string;
  renamingInfo: { id: string; type: 'library' | 'subfolder' } | null;
  isAddingLibrary: boolean;
  newLibraryName: string;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  addLibraryInputRef: React.RefObject<HTMLInputElement | null>;
  handleLibrarySelect: (id: string) => void;
  handleSingleClick: (action: () => void) => void;
  handleDoubleClick: (action: () => void) => void;
  setRenamingInfo: (
    info: { id: string; type: 'library' | 'subfolder' } | null
  ) => void;
  handleRename: (newName: string) => void;
  handleRenameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setIsAddingLibrary: (isAdding: boolean) => void;
  setNewLibraryName: (name: string) => void;
  handleAddLibraryKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleConfirmAddLibrary: () => void;
  handleCancelAddLibrary: () => void;
  handleInitiateDeleteLibrary: (library: Library) => void;
};
const SidebarContent: React.FC<SidebarContentProps> = ({
  libraries,
  selectedLibraryId,
  renamingInfo,
  isAddingLibrary,
  newLibraryName,
  renameInputRef,
  addLibraryInputRef,
  handleLibrarySelect,
  handleSingleClick,
  handleDoubleClick,
  setRenamingInfo,
  handleRename,
  handleRenameKeyDown,
  setIsAddingLibrary,
  setNewLibraryName,
  handleAddLibraryKeyDown,
  handleConfirmAddLibrary,
  handleCancelAddLibrary,
  handleInitiateDeleteLibrary
}) => (
  <div className='flex h-full flex-col not-dark:bg-slate-50'>
    <div className='border-b p-4'>
      <h2 className='flex items-center text-xl font-semibold'>
        <LayoutList className='mr-3 h-6 w-6 text-orange-600' /> Libraries
      </h2>
    </div>
    <nav className='flex-1 space-y-1 overflow-y-auto px-2 py-4'>
      <button
        onClick={() => handleLibrarySelect(ALL_DOCUMENTS_ID)}
        className={`flex w-full items-center rounded-md p-2 text-left text-sm font-medium transition-colors ${selectedLibraryId === ALL_DOCUMENTS_ID ? 'border-l-4 border-orange-500 bg-orange-100 font-bold text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <Folder className='mr-3 h-5 w-5 flex-shrink-0' /> All Documents
      </button>
      <div className='pt-2'></div>
      {libraries.map((library) => (
        <div
          key={library.id}
          className={`flex w-full cursor-pointer items-center justify-between rounded-md p-2 text-left text-sm font-medium transition-colors ${selectedLibraryId === library.id ? 'border-l-4 border-orange-500 bg-orange-100 font-bold text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() =>
            handleSingleClick(() => handleLibrarySelect(library.id))
          }
          onDoubleClick={() =>
            handleDoubleClick(() =>
              setRenamingInfo({ id: library.id, type: 'library' })
            )
          }
        >
          {renamingInfo?.id === library.id &&
          renamingInfo.type === 'library' ? (
            <Input
              defaultValue={library.name}
              ref={renameInputRef as React.RefObject<HTMLInputElement>}
              onBlur={(e) => handleRename(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              className='h-8'
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span className='flex items-center truncate'>
                <Folder className='mr-3 h-5 w-5 flex-shrink-0' />
                <span className='truncate'>{library.name}</span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 flex-shrink-0'
                  >
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem
                    className='text-red-500 focus:bg-red-50 focus:text-red-500'
                    onClick={() => handleInitiateDeleteLibrary(library)}
                  >
                    <Trash2 className='mr-2 h-4 w-4' /> Delete Library
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      ))}
      {isAddingLibrary ? (
        <div className='flex items-center gap-2 p-2'>
          <Input
            ref={addLibraryInputRef as React.RefObject<HTMLInputElement>}
            placeholder='New library name...'
            className='h-8'
            value={newLibraryName}
            onChange={(e) => setNewLibraryName(e.target.value)}
            onKeyDown={handleAddLibraryKeyDown}
          />
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-green-600 hover:text-green-600'
            onClick={handleConfirmAddLibrary}
          >
            <Check className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-red-600 hover:text-red-600'
            onClick={handleCancelAddLibrary}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <Button
          variant='ghost'
          className='mt-2 w-full justify-start text-gray-600'
          onClick={() => setIsAddingLibrary(true)}
        >
          <Plus className='mr-2 h-4 w-4' /> Add Library
        </Button>
      )}
    </nav>
    <div className='space-y-2 border-t p-3'>
      <div className='flex items-center p-2 text-sm font-semibold text-gray-600'>
        <Settings className='mr-2 h-4 w-4' /> Library Settings
      </div>
      <Button
        variant='ghost'
        className='w-full justify-start text-gray-600'
        onClick={() => toast.info('Saving structure...')}
      >
        <Save className='mr-2 h-4 w-4' /> Save Library Structure
      </Button>
      <Button
        variant='ghost'
        className='w-full justify-start text-gray-600'
        onClick={() => toast.info('Importing structure...')}
      >
        <Upload className='mr-2 h-4 w-4' /> Import Library Structure
      </Button>
    </div>
  </div>
);
// #endregion

// #region SubfolderView Component
type SubfolderViewProps = {
  filteredSubfolders: Subfolder[];
  selectedSubfolderId: string | null;
  renamingInfo: { id: string; type: 'library' | 'subfolder' } | null;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  isAddingSubfolder: boolean;
  addSubfolderInputRef: React.RefObject<HTMLInputElement | null>;
  newSubfolderName: string;
  folderSearchTerm: string;
  setFolderSearchTerm: (term: string) => void;
  handleSubfolderSelect: (id: string) => void;
  handleSingleClick: (action: () => void) => void;
  handleDoubleClick: (action: () => void) => void;
  setRenamingInfo: (
    info: { id: string; type: 'library' | 'subfolder' } | null
  ) => void;
  handleRename: (newName: string) => void;
  handleRenameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInitiateAddSubfolder: () => void;
  setNewSubfolderName: (name: string) => void;
  handleAddSubfolderKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCancelAddSubfolder: () => void;
  handleInitiateDeleteSubfolder: () => void;
};
const SubfolderView: React.FC<SubfolderViewProps> = ({
  filteredSubfolders,
  selectedSubfolderId,
  renamingInfo,
  renameInputRef,
  isAddingSubfolder,
  addSubfolderInputRef,
  newSubfolderName,
  folderSearchTerm,
  setFolderSearchTerm,
  handleSubfolderSelect,
  handleSingleClick,
  handleDoubleClick,
  setRenamingInfo,
  handleRename,
  handleRenameKeyDown,
  handleInitiateAddSubfolder,
  setNewSubfolderName,
  handleAddSubfolderKeyDown,
  handleCancelAddSubfolder,
  handleInitiateDeleteSubfolder
}) => (
  <section className='mb-8' aria-labelledby='subfolders-heading'>
    <div className='mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center'>
      <div className='flex flex-wrap items-center gap-2'>
        <Button variant='outline' onClick={handleInitiateAddSubfolder}>
          <Plus className='mr-2 h-4 w-4' /> Add Folder
        </Button>
        <Button
          variant='outline'
          onClick={handleInitiateDeleteSubfolder}
          disabled={!selectedSubfolderId}
        >
          <Trash2 className='mr-2 h-4 w-4' /> Delete Folder
        </Button>
      </div>
      <div className='relative w-full md:w-64'>
        <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
        <Input
          placeholder='Search folders...'
          className='pl-10'
          value={folderSearchTerm}
          onChange={(e) => setFolderSearchTerm(e.target.value)}
        />
      </div>
    </div>
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
      {isAddingSubfolder && (
        <div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 text-center'>
          <Folder className='mx-auto h-12 w-12 text-gray-400' />
          <Input
            ref={addSubfolderInputRef as React.RefObject<HTMLInputElement>}
            placeholder='New folder name'
            className='mt-2 h-8'
            value={newSubfolderName}
            onChange={(e) => setNewSubfolderName(e.target.value)}
            onKeyDown={handleAddSubfolderKeyDown}
            onBlur={handleCancelAddSubfolder}
          />
        </div>
      )}
      {filteredSubfolders.map((subfolder) => (
        <div
          key={subfolder.id}
          className={`cursor-pointer rounded-lg border p-3 text-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${selectedSubfolderId === subfolder.id ? 'border-b-4 border-b-blue-500 shadow-sm not-dark:bg-blue-100' : 'border-transparent not-dark:bg-gray-100 hover:bg-gray-200'}`}
          onClick={() =>
            handleSingleClick(() => handleSubfolderSelect(subfolder.id))
          }
          onDoubleClick={() =>
            handleDoubleClick(() =>
              setRenamingInfo({ id: subfolder.id, type: 'subfolder' })
            )
          }
        >
          <img
            src='/assets/file-icons/open-folder.png'
            alt={`${subfolder.name} folder`}
            className={`mx-auto h-12 w-12`}
          />
          {renamingInfo?.id === subfolder.id &&
          renamingInfo.type === 'subfolder' ? (
            <Input
              defaultValue={subfolder.name}
              ref={renameInputRef as React.RefObject<HTMLInputElement>}
              onBlur={(e) => handleRename(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              className='mt-2 h-8'
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p className='mt-2 truncate text-sm font-medium text-gray-700'>
              {subfolder.name}
            </p>
          )}
        </div>
      ))}
    </div>
  </section>
);
// #endregion

// #region FileListView Component
type FileListViewProps = {
  heading: string;
  filteredFiles: FileData[];
  selectedFiles: string[];
  canAddDocument: boolean;
  fileSearchTerm: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleSelectAllFiles: (checked: boolean) => void;
  handleFileSelect: (id: string) => void;
  handleDeleteFiles: () => void;
  handleInitiateUpload: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenFileInNewTab: (fileKey: string, fileName: string) => void;
  handleDownloadFile: (fileKey: string, filename: string) => void;
  setFileSearchTerm: (term: string) => void;
  onInitiateSplit: () => void;
  onInitiateMerge: () => void;
};
const FileListView: React.FC<FileListViewProps> = ({
  heading,
  filteredFiles,
  selectedFiles,
  canAddDocument,
  fileSearchTerm,
  fileInputRef,
  handleSelectAllFiles,
  handleFileSelect,
  handleDeleteFiles,
  handleInitiateUpload,
  handleFileUpload,
  handleOpenFileInNewTab,
  handleDownloadFile,
  setFileSearchTerm,
  onInitiateSplit,
  onInitiateMerge
}) => (
  <section aria-labelledby='files-heading'>
    <input
      type='file'
      ref={fileInputRef as React.RefObject<HTMLInputElement>}
      onChange={handleFileUpload}
      multiple
      hidden
      accept='.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg'
    />

    <h2 id='files-heading' className='mb-5 text-xl font-semibold text-gray-800'>
      {heading}
    </h2>

    <div className='flex flex-wrap items-center justify-between gap-2 my-5'>
      <Button
        variant='outline'
        onClick={handleInitiateUpload}
        disabled={!canAddDocument}
      >
        <Plus className='mr-2 h-4 w-4' /> Add Document
      </Button>
      <Button
        variant='outline'
        onClick={handleDeleteFiles}
        disabled={selectedFiles.length === 0}
      >
        <Trash2 className='mr-2 h-4 w-4' /> Delete Files
      </Button>

      <Button
        variant='outline'
        onClick={onInitiateSplit}
        disabled={selectedFiles.length !== 1}
        title={
          selectedFiles.length !== 1
            ? 'Please select exactly one PDF file to split'
            : 'Split selected PDF'
        }
      >
        <Scissors className='mr-2 h-4 w-4' /> Split PDF
      </Button>
      <Button
        variant='outline'
        onClick={onInitiateMerge}
        disabled={selectedFiles.length < 2}
        title={
          selectedFiles.length < 2
            ? 'Please select two or more PDF files to merge'
            : 'Merge selected PDFs'
        }
      >
        <Copy className='mr-2 h-4 w-4' /> Merge PDF
      </Button>

      <div className='relative w-full md:w-52'>
        <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
        <Input
          placeholder='Search files...'
          className='pl-10 '
          value={fileSearchTerm}
          onChange={(e) => setFileSearchTerm(e.target.value)}
        />
      </div>
    </div>

    <div className='overflow-x-auto rounded-lg border'>
      <Table>
        <TableHeader className='not-dark:bg-gray-50'>
          <TableRow>
            <TableHead className='w-[50px] px-4'>
              <Checkbox
                checked={
                  selectedFiles.length === filteredFiles.length &&
                  filteredFiles.length > 0
                }
                onCheckedChange={(checked) =>
                  handleSelectAllFiles(Boolean(checked))
                }
                aria-label='Select all files'
              />
            </TableHead>
            <TableHead className='w-[50px]'>File</TableHead>
            <TableHead>Name</TableHead>
            {/* <TableHead>Size</TableHead> */}
            <TableHead>Creation Date</TableHead>
            <TableHead>Directory</TableHead>
            <TableHead className='pr-4 text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell className='px-4'>
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={() => handleFileSelect(file.id)}
                    aria-label={`Select file ${file.name}`}
                  />
                </TableCell>
                <TableCell>
                  <FileIcon className='h-5 w-5 text-red-500' />
                </TableCell>
                <TableCell className='font-medium text-gray-800'>
                  {file.name}
                </TableCell>
                {/* <TableCell className='text-gray-600'>
                  {formatBytes(file.size)}
                </TableCell> */}
                <TableCell className='text-gray-600'>
                  {file.creationDate}
                </TableCell>
                <TableCell className='text-gray-600'>
                  {file.directory}
                </TableCell>
                <TableCell className='pr-4 text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      aria-label={`Download ${file.name}`}
                      onClick={() => handleDownloadFile(file.url, file.name)}
                    >
                      <Download className='h-5 w-5' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      aria-label={`Open ${file.name} in new tab`}
                      onClick={() =>
                        handleOpenFileInNewTab(file.url, file.name)
                      }
                    >
                      <ExternalLink className='h-5 w-5' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center text-gray-500'>
                No documents found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </section>
);
// #endregion

// =================================================================================
// MAIN COMPONENT (Refactored for Performance)
// =================================================================================
export default function FilesandDocuments({ engagement }: any) {
  // --- STATE MANAGEMENT (Decoupled for lazy loading) ---
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [subfolders, setSubfolders] = useState<Subfolder[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);

  const [isLibrariesLoading, setIsLibrariesLoading] = useState(true);
  const [isSubfoldersLoading, setIsSubfoldersLoading] = useState(false);
  const [isFilesLoading, setIsFilesLoading] = useState(false);

  const [selectedLibraryId, setSelectedLibraryId] =
    useState<string>(ALL_DOCUMENTS_ID);
  const [selectedSubfolderId, setSelectedSubfolderId] = useState<string | null>(
    null
  );

  // Other UI state
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [folderSearchTerm, setFolderSearchTerm] = useState('');
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [renamingInfo, setRenamingInfo] = useState<{
    id: string;
    type: 'library' | 'subfolder';
  } | null>(null);
  const [isAddingLibrary, setIsAddingLibrary] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState('');
  const [isAddingSubfolder, setIsAddingSubfolder] = useState(false);
  const [newSubfolderName, setNewSubfolderName] = useState('');
  const [primaryRootId, setPrimaryRootId] = useState<string | null>(null);

  // Refs
  const renameInputRef = useRef<HTMLInputElement>(null);
  const addLibraryInputRef = useRef<HTMLInputElement>(null);
  const addSubfolderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 4. ADD NEW STATE FOR THE MODAL
  const [pdfToolMode, setPdfToolMode] = useState<'split' | 'merge' | null>(
    null
  );

  // --- DATA FETCHING (Lazy Loading Implementation) ---

  const fetchLibraries = useCallback(async () => {
    if (!engagement?.id) return;
    setIsLibrariesLoading(true);
    try {
      const roots = await getRoots(engagement.id);
      if (!roots || roots.length === 0) {
        setLibraries([]);
        return;
      }
      setPrimaryRootId(roots[0].id);

      let allRootFolders: any[] = [];
      for (const root of roots) {
        const foldersForRoot = await getRootFolders(root.id);
        allRootFolders.push(
          ...foldersForRoot.filter((f: any) => f.parentId === null)
        );
      }
      setLibraries(allRootFolders);

      // Default selection logic
      if (selectedLibraryId === ALL_DOCUMENTS_ID) {
        const auditProcedures = allRootFolders.find(
          (lib) => lib.name === 'Audit Procedures'
        );
        if (auditProcedures) {
          setSelectedLibraryId(auditProcedures.id);
        } else if (allRootFolders.length > 0) {
          setSelectedLibraryId(allRootFolders[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch libraries:', error);
      toast.error('Failed to load document libraries.');
    } finally {
      setIsLibrariesLoading(false);
    }
  }, [engagement?.id, selectedLibraryId]);

  const fetchSubfolders = useCallback(async (libraryId: string) => {
    if (!libraryId || libraryId === ALL_DOCUMENTS_ID) return;
    setIsSubfoldersLoading(true);
    setSubfolders([]);
    try {
      const subfoldersFromApi = await getSubFolders(libraryId);
      setSubfolders(subfoldersFromApi);
    } catch (error) {
      console.error('Failed to fetch subfolders:', error);
      toast.error('Failed to load folders for this library.');
    } finally {
      setIsSubfoldersLoading(false);
    }
  }, []);

  const fetchFiles = useCallback(
    async (subfolderId: string) => {
      if (!subfolderId) return;
      setIsFilesLoading(true);
      setFiles([]);

      const currentLibrary = libraries.find(
        (lib) => lib.id === selectedLibraryId
      );
      const currentSubfolder = subfolders.find((sub) => sub.id === subfolderId);
      if (!currentLibrary || !currentSubfolder) {
        setIsFilesLoading(false);
        return;
      }

      try {
        const filesFromApi = await getFiles(subfolderId);
        const formattedFiles: FileData[] = filesFromApi.map((file: any) => ({
          id: file.id,
          name: file.fileName,
          size: file.size,
          creationDate: new Date(file.uploadedAt).toLocaleString(),
          directory: `${currentLibrary.name}/${currentSubfolder.name}`,
          url: file.fileUrl
        }));
        setFiles(formattedFiles);
      } catch (error) {
        console.error('Failed to fetch files:', error);
        toast.error('Failed to load documents for this folder.');
      } finally {
        setIsFilesLoading(false);
      }
    },
    [libraries, subfolders, selectedLibraryId]
  );

  // --- USEEFFECT HOOKS FOR ORCHESTRATION ---

  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries]);

  useEffect(() => {
    // When library selection changes, clear downstream state and fetch new subfolders.
    setSelectedSubfolderId(null);
    setFiles([]);
    setSubfolders([]);
    fetchSubfolders(selectedLibraryId);
  }, [selectedLibraryId, fetchSubfolders]);

  useEffect(() => {
    // When subfolder selection changes, clear files and fetch new ones.
    setFiles([]);
    fetchFiles(selectedSubfolderId!);
  }, [selectedSubfolderId, fetchFiles]);

  // --- UI INTERACTION HANDLERS ---

  useEffect(() => {
    if (renamingInfo) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renamingInfo]);

  useEffect(() => {
    if (isAddingLibrary) addLibraryInputRef.current?.focus();
  }, [isAddingLibrary]);

  useEffect(() => {
    if (isAddingSubfolder) addSubfolderInputRef.current?.focus();
  }, [isAddingSubfolder]);

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);

  const handleSingleClick = (action: () => void) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    clickTimerRef.current = setTimeout(() => {
      action();
      clickTimerRef.current = null;
    }, CLICK_DELAY);
  };

  const handleDoubleClick = (renameAction: () => void) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    renameAction();
  };

  // --- CRUD and STATE CHANGE HANDLERS ---

  const handleLibrarySelect = (libraryId: string) => {
    if (renamingInfo || isAddingLibrary) return;
    setSelectedLibraryId(libraryId);
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const handleSubfolderSelect = (subfolderId: string) => {
    if (renamingInfo || isAddingSubfolder) return;
    setSelectedSubfolderId(subfolderId);
  };

  const handleConfirmAddLibrary = async () => {
    const trimmedName = newLibraryName.trim();
    if (!trimmedName || !primaryRootId) return;
    try {
      await createRootFolder({ rootId: primaryRootId, name: trimmedName });
      toast.success(`Library "${trimmedName}" created.`);
      await fetchLibraries();
    } catch (error) {
      toast.error('Failed to create library.');
    } finally {
      setNewLibraryName('');
      setIsAddingLibrary(false);
    }
  };

  const handleCancelAddLibrary = () => {
    setNewLibraryName('');
    setIsAddingLibrary(false);
  };

  const handleAddLibraryKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') handleConfirmAddLibrary();
    if (e.key === 'Escape') handleCancelAddLibrary();
  };

  const handleInitiateAddSubfolder = () => {
    if (selectedLibraryId === ALL_DOCUMENTS_ID) {
      toast.error('Please select a library first.');
      return;
    }
    setIsAddingSubfolder(true);
  };

  const handleConfirmAddSubfolder = async () => {
    const trimmedName = newSubfolderName.trim();
    if (!trimmedName || !selectedLibraryId) return;
    try {
      await createSubFolder({ parentId: selectedLibraryId, name: trimmedName });
      toast.success(`Folder "${trimmedName}" created.`);
      await fetchSubfolders(selectedLibraryId); // Only refetch subfolders
    } catch (error) {
      toast.error('Failed to create folder.');
    } finally {
      setNewSubfolderName('');
      setIsAddingSubfolder(false);
    }
  };

  const handleCancelAddSubfolder = () => {
    setNewSubfolderName('');
    setIsAddingSubfolder(false);
  };

  const handleAddSubfolderKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') handleConfirmAddSubfolder();
    if (e.key === 'Escape') handleCancelAddSubfolder();
  };

  const handleInitiateUpload = () => {
    if (!selectedSubfolderId) {
      toast.error('Please select a subfolder to add a document.');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0 || !selectedSubfolderId) {
      if (e.target) e.target.value = '';
      return;
    }

    const currentLibrary = libraries.find(
      (lib) => lib.id === selectedLibraryId
    );
    const currentSubfolder = subfolders.find(
      (sub) => sub.id === selectedSubfolderId
    );
    if (!currentLibrary || !currentSubfolder) {
      toast.error('Could not find destination folder.');
      return;
    }

    const folderName = `${currentLibrary.name}/${currentSubfolder.name}`;
    const uploadToast = toast.loading(
      `Uploading ${selectedFiles.length} file(s)...`
    );

    try {
      const uploadedFilesInfo = await uploadMultipleFiles(
        Array.from(selectedFiles),
        folderName
      );
      toast.info('Saving file records...', { id: uploadToast });

      const createFilePromises = uploadedFilesInfo.map((s3Info, index) => {
        const originalFile = selectedFiles[index];
        const payload = {
          folderId: selectedSubfolderId,
          fileName: originalFile.name,
          fileUrl: s3Info.fileKey,
          size: originalFile.size
        };
        return createFile(payload);
      });

      await Promise.all(createFilePromises);
      toast.success(
        `Successfully uploaded and saved ${selectedFiles.length} file(s).`,
        { id: uploadToast }
      );
      await fetchFiles(selectedSubfolderId); // Only refetch files
    } catch (error) {
      toast.error('File upload failed.', { id: uploadToast });
      console.error('Upload process failed:', error);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleRename = async (newName: string) => {
    if (!renamingInfo || !newName.trim()) {
      setRenamingInfo(null);
      return;
    }
    const { id, type } = renamingInfo;
    try {
      if (type === 'library') {
        await renameRootFolder(id, { name: newName });
        await fetchLibraries();
      } else {
        await renameSubFolder(id, { name: newName });
        await fetchSubfolders(selectedLibraryId);
      }
      toast.success(`${type === 'library' ? 'Library' : 'Folder'} renamed.`);
    } catch (error) {
      toast.error(`Failed to rename ${type}.`);
    } finally {
      setRenamingInfo(null);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleRename(e.currentTarget.value);
    if (e.key === 'Escape') setRenamingInfo(null);
  };

  const handleInitiateDeleteLibrary = (library: Library) => {
    toast.error(`Are you sure you want to delete "${library.name}"?`, {
      action: {
        label: 'Confirm',
        onClick: async () => {
          try {
            await deleteRootFolder(library.id);
            toast.success('Library deleted.');
            if (selectedLibraryId === library.id)
              setSelectedLibraryId(ALL_DOCUMENTS_ID);
            await fetchLibraries();
          } catch (error) {
            toast.error('Failed to delete library.');
          }
        }
      }
    });
  };

  const handleInitiateDeleteSubfolder = () => {
    const subfolder = subfolders.find((s) => s.id === selectedSubfolderId);
    if (!subfolder) return;
    toast.error(`Are you sure you want to delete "${subfolder.name}"?`, {
      action: {
        label: 'Confirm',
        onClick: async () => {
          try {
            await deleteSubFolder(subfolder.id);
            toast.success('Folder deleted.');
            setSelectedSubfolderId(null);
            await fetchSubfolders(selectedLibraryId);
          } catch (error) {
            toast.error('Failed to delete folder.');
          }
        }
      }
    });
  };

  const handleDeleteFiles = async () => {
    if (selectedFiles.length === 0 || !selectedSubfolderId) return;
    const deleteToast = toast.loading(
      `Deleting ${selectedFiles.length} file(s)...`
    );
    try {
      await Promise.all(selectedFiles.map((id) => deleteFile(id)));
      toast.success(`${selectedFiles.length} file(s) deleted.`, {
        id: deleteToast
      });
      setSelectedFiles([]);
      await fetchFiles(selectedSubfolderId);
    } catch (error) {
      toast.error('Failed to delete files.', { id: deleteToast });
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleOpenFileInNewTab = (fileKey: string, fileName: string) => {
    // No async/await or toasts are needed here anymore. It's a direct navigation.

    // 1. Get the file's MIME type from its name.
    const fileType = getMimeType(fileName);

    // 2. Construct the URL for your viewer page.
    //    All these parameters are simple strings and are safe to encode.
    const viewerUrl = `/view-document?fileKey=${encodeURIComponent(fileKey)}&fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}`;

    // 3. Open the viewer in a new tab.
    window.open(viewerUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadFile = async (fileKey: string, filename: string) => {
    const downloadToast = toast.loading('Preparing download...');
    try {
      const accessUrl = await getAccessUrlForFile(fileKey);
      const response = await fetch(accessUrl);
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('Download started.', { id: downloadToast });
    } catch (error) {
      toast.error('Failed to download file.', { id: downloadToast });
    }
  };

  // 5. ADD HANDLERS TO OPEN THE MODAL
  const handleInitiateSplit = () => {
    const selectedPdfs = files.filter(
      (f) =>
        selectedFiles.includes(f.id) && f.name.toLowerCase().endsWith('.pdf')
    );
    if (selectedPdfs.length !== 1) {
      toast.error('Please select exactly one PDF file to split.');
      return;
    }
    setPdfToolMode('split');
  };

  const handleInitiateMerge = () => {
    const selectedPdfs = files.filter(
      (f) =>
        selectedFiles.includes(f.id) && f.name.toLowerCase().endsWith('.pdf')
    );
    if (selectedPdfs.length < 2) {
      toast.error('Please select at least two PDF files to merge.');
      return;
    }
    setPdfToolMode('merge');
  };

  const closePdfToolsModal = () => {
    setPdfToolMode(null);
  };

  // --- MEMOIZED VALUES ---

  const selectedLibrary = useMemo(
    () => libraries.find((lib) => lib.id === selectedLibraryId),
    [libraries, selectedLibraryId]
  );

  const filteredSubfolders = useMemo(
    () =>
      subfolders.filter((subfolder) =>
        subfolder.name.toLowerCase().includes(folderSearchTerm.toLowerCase())
      ),
    [subfolders, folderSearchTerm]
  );

  const filteredFiles = useMemo(
    () =>
      files.filter((file) =>
        file.name.toLowerCase().includes(fileSearchTerm.toLowerCase())
      ),
    [files, fileSearchTerm]
  );

  const handleSelectAllFiles = (isChecked: boolean) =>
    setSelectedFiles(isChecked ? filteredFiles.map((file) => file.id) : []);

  // --- PROPS FOR CHILD COMPONENTS ---

  const sidebarProps = {
    libraries,
    selectedLibraryId,
    renamingInfo,
    isAddingLibrary,
    newLibraryName,
    renameInputRef,
    addLibraryInputRef,
    handleLibrarySelect,
    handleSingleClick,
    handleDoubleClick,
    setRenamingInfo,
    handleRename,
    handleRenameKeyDown,
    setIsAddingLibrary,
    setNewLibraryName,
    handleAddLibraryKeyDown,
    handleConfirmAddLibrary,
    handleCancelAddLibrary,
    handleInitiateDeleteLibrary
  };

  const subfolderViewProps = {
    filteredSubfolders,
    selectedSubfolderId,
    renamingInfo,
    renameInputRef,
    isAddingSubfolder,
    addSubfolderInputRef,
    newSubfolderName,
    folderSearchTerm,
    setFolderSearchTerm,
    handleSubfolderSelect,
    handleSingleClick,
    handleDoubleClick,
    setRenamingInfo,
    handleRename,
    handleRenameKeyDown,
    handleInitiateAddSubfolder,
    setNewSubfolderName,
    handleAddSubfolderKeyDown,
    handleCancelAddSubfolder,
    handleInitiateDeleteSubfolder
  };

  const fileListViewProps = {
    heading:
      subfolders.find((s) => s.id === selectedSubfolderId)?.name || 'Files',
    filteredFiles,
    selectedFiles,
    canAddDocument: !!selectedSubfolderId,
    fileSearchTerm,
    fileInputRef,
    handleSelectAllFiles,
    handleFileSelect,
    handleDeleteFiles,
    handleInitiateUpload,
    handleFileUpload,
    handleOpenFileInNewTab,
    handleDownloadFile,
    setFileSearchTerm,
    onInitiateSplit: handleInitiateSplit,
    onInitiateMerge: handleInitiateMerge
  };

  // --- RENDER LOGIC ---

  // if (isLibrariesLoading) {
  //   return (
  //     <div className='flex h-[50vh] items-center justify-center p-10'>
  //       <div className='h-8 w-8 animate-spin rounded-full border-4 border-dashed border-amber-500'></div>
  //     </div>
  //   );
  // }

  return (
    <div className='flex h-auto font-sans not-dark:bg-white'>
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side='left' className='w-80 p-0 md:hidden'>
          <SheetHeader>
            <SheetTitle className='sr-only'>Libraries</SheetTitle>
          </SheetHeader>
          <SidebarContent {...sidebarProps} />
        </SheetContent>
      </Sheet>
      <aside className='hidden md:flex md:w-80 md:flex-col md:border-r'>
        <SidebarContent {...sidebarProps} />
      </aside>
      <main className='flex flex-1 flex-col overflow-y-auto p-4 md:p-6'>
        <header className='mb-6 flex items-center justify-between'>
          <h1 className='truncate pr-4 text-2xl font-bold text-gray-800'>
            {(selectedLibraryId === ALL_DOCUMENTS_ID
              ? 'All Documents'
              : selectedLibrary?.name) || 'Select a Library'}
          </h1>
          <div className='md:hidden'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className='h-6 w-6' />
            </Button>
          </div>
        </header>

        {selectedLibraryId !== ALL_DOCUMENTS_ID &&
          (isSubfoldersLoading ? (
            <div className='flex h-48 items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
              <span className='ml-2 text-gray-600'>Loading Folders...</span>
            </div>
          ) : (
            <SubfolderView {...subfolderViewProps} />
          ))}

        {selectedSubfolderId &&
          (isFilesLoading ? (
            <div className='flex h-48 items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
              <span className='ml-2 text-gray-600'>Loading Documents...</span>
            </div>
          ) : (
            <FileListView {...fileListViewProps} />
          ))}
      </main>

      {/* 7. RENDER THE MODAL CONDITIONALLY */}
      {pdfToolMode && (
        <PdfToolsModal
          isOpen={!!pdfToolMode}
          onClose={closePdfToolsModal}
          mode={pdfToolMode}
          files={files.filter((f) => selectedFiles.includes(f.id))}
        />
      )}
    </div>
  );
}
