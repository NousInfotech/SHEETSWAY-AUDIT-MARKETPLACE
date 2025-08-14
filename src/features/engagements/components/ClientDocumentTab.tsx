"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Folder as FolderIcon, File as FileIcon, X, Save, Upload, ChevronRight, ChevronDown } from "lucide-react";

interface FileSystemEntity {
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string | ArrayBuffer | null;
  children?: FileSystemEntity[];
  isOpen?: boolean; // To track folder's collapsed state
}

const ClientDocument = () => {
  const [items, setItems] = useState<FileSystemEntity[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileSystemEntity | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("clientfileSystem");
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to parse file system from local storage:", error);
    }
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileSystemEntity[] = Array.from(files).map((file) => ({
        name: file.name,
        type: "file",
        path: file.webkitRelativePath || file.name,
      }));
      setItems((prevItems) => [...prevItems, ...newFiles]);
    }
  };

  const handleFolderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const folderStructure = buildFolderStructure(Array.from(files));
      setItems((prevItems) => [...prevItems, ...folderStructure]);
    }
  };

  const buildFolderStructure = (files: File[]): FileSystemEntity[] => {
    const root: FileSystemEntity = { name: "root", type: "folder", path: "", children: [], isOpen: true };
    const folderName = files[0].webkitRelativePath.split('/')[0];

    files.forEach((file) => {
        const pathParts = file.webkitRelativePath.split("/").slice(1);
        let currentLevel = root.children!;

        pathParts.forEach((part, index) => {
            const isFile = index === pathParts.length - 1;
            let existing = currentLevel.find(item => item.name === part && item.type === (isFile ? 'file' : 'folder'));

            if (!existing) {
                existing = {
                    name: part,
                    type: isFile ? "file" : "folder",
                    path: file.webkitRelativePath,
                    children: isFile ? undefined : [],
                    isOpen: isFile ? undefined : true,
                };
                currentLevel.push(existing);
            }

            if (!isFile) {
                currentLevel = existing.children!;
            }
        });
    });

    const mainFolder: FileSystemEntity = {
      name: folderName,
      type: "folder",
      path: folderName,
      children: root.children,
      isOpen: true,
    };

    return [mainFolder];
  };

  const handleToggleFolder = (path: string) => {
    const toggle = (nodes: FileSystemEntity[]): FileSystemEntity[] => {
      return nodes.map(node => {
        if (node.path === path) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: toggle(node.children) };
        }
        return node;
      });
    };
    setItems(prevItems => toggle(prevItems));
  };

  const handleFilePreview = (file: FileSystemEntity) => {
    if (file.content) {
        setSelectedFile(file);
        return;
    }
    const allUploadedFiles = [
      ...(fileInputRef.current?.files ? Array.from(fileInputRef.current.files) : []),
      ...(folderInputRef.current?.files ? Array.from(folderInputRef.current.files) : [])
    ];
    const uploadedFile = allUploadedFiles.find(f => (f.webkitRelativePath || f.name) === file.path);

    if (uploadedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedFile({ ...file, content: e.target?.result });
        };
        reader.readAsDataURL(uploadedFile);
    }
  };

  const saveToLocalStorage = useCallback(() => {
    // The 'items' state already includes the 'isOpen' property,
    // so we just need to stringify and save it.
    // The file content processing logic remains the same.
    const processAndSave = async () => {
        const allUploadedFiles = [
            ...(fileInputRef.current?.files ? Array.from(fileInputRef.current.files) : []),
            ...(folderInputRef.current?.files ? Array.from(folderInputRef.current.files) : [])
        ];
        const readFileAsBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        };
        const processItem = async (item: FileSystemEntity): Promise<FileSystemEntity> => {
          if (item.type === 'file' && !item.content) {
            const fileToRead = allUploadedFiles.find(f => (f.webkitRelativePath || f.name) === item.path);
            if (fileToRead) {
              const content = await readFileAsBase64(fileToRead);
              return { ...item, content };
            }
          }
          if(item.children){
            const savedChildren = await Promise.all(item.children.map(child => processItem(child)));
            return {...item, children: savedChildren};
          }
          return item;
        };
        try {
            const itemsToSave = await Promise.all(items.map(processItem));
            localStorage.setItem("clientfileSystem", JSON.stringify(itemsToSave));
            alert("Files and folders saved to local storage!");
        } catch (error) {
            console.error("Error saving files to local storage:", error);
            alert("An error occurred while saving. See console for details.");
        }
    };
    processAndSave();
  }, [items]);

  const renderItems = (itemsToRender: FileSystemEntity[]) => (
    <ul>
      {itemsToRender.map((item) => (
        <li key={item.path}>
          <div
            className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => item.type === 'file' ? handleFilePreview(item) : handleToggleFolder(item.path)}
          >
            <div className="flex items-center truncate">
              {item.type === "folder" ? (
                <>
                  {item.isOpen ? <ChevronDown className="w-5 h-5 mr-2 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 mr-2 flex-shrink-0" />}
                  <FolderIcon className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
                </>
              ) : (
                <FileIcon className="w-5 h-5 mr-2 text-gray-500 flex-shrink-0 ml-7" /> // ml-7 to align with folder content
              )}
              <span className="truncate">{item.name}</span>
            </div>
          </div>
          {item.isOpen && item.type === "folder" && item.children && item.children.length > 0 && (
            <div className="pl-5 border-l-2 ml-[1.125rem]">
              {renderItems(item.children)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Client Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Upload Files
            </Button>
            <Input type="file" ref={fileInputRef} multiple onChange={handleFileChange} className="hidden" />
            <Button onClick={() => folderInputRef.current?.click()} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload Folder
            </Button>
            <Input type="file" ref={folderInputRef} onChange={handleFolderChange} className="hidden" {...{ webkitdirectory: "" }} />
            <Button onClick={saveToLocalStorage} variant="secondary">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
          <div className="border rounded-md p-4 min-h-[24rem] h-96 overflow-y-auto">
            {items.length > 0 ? (
              renderItems(items)
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No files or folders uploaded.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedFile(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-3xl h-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold truncate">{selectedFile.name}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 flex-grow overflow-auto">
              {selectedFile.content && typeof selectedFile.content === 'string' && selectedFile.content.startsWith('data:image') ? (
                <img src={selectedFile.content} alt={selectedFile.name} className="max-w-full h-auto mx-auto" />
              ) : selectedFile.content && typeof selectedFile.content === 'string' && selectedFile.content.startsWith('data:application/pdf') ? (
                <iframe src={selectedFile.content} className="w-full h-full" title={selectedFile.name}></iframe>
              ) : (
                <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                    <FileIcon className="w-16 h-16 mb-4" />
                    <p>No preview available for this file type.</p>
                    <p className="text-sm mt-2">File: {selectedFile.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDocument;