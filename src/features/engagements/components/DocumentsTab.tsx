import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/file-uploader';
import { Download, Trash2 } from 'lucide-react';

// Mock data for uploaded and delivered documents
const mockClientFiles = [
  { name: 'Internal_Report_Q1.pdf', size: '1.2MB', uploadedAt: '2024-07-20' },
  { name: 'Bank_Statement.xlsx', size: '800KB', uploadedAt: '2024-07-18' },
];
const mockAuditorFiles = [
  { name: 'Audit_Working_Paper.pdf', size: '2.1MB', deliveredAt: '2024-07-21' },
  { name: 'Final_Audit_Report.pdf', size: '1.8MB', deliveredAt: '2024-07-22' },
];

const DocumentsTab: React.FC = () => {
  const [clientFiles, setClientFiles] = useState(mockClientFiles);
  const [auditorFiles] = useState(mockAuditorFiles);

  const handleUpload = async (files: File[]) => {
    // TODO: Integrate with backend API
    // For now, just add to mock list
    const newFiles = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
      uploadedAt: new Date().toISOString().slice(0, 10),
    }));
    setClientFiles((prev) => [...newFiles, ...prev]);
  };

  const handleDelete = (name: string) => {
    setClientFiles((prev) => prev.filter((file) => file.name !== name));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Internal Files</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploader onUpload={handleUpload} multiple maxFiles={10} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {clientFiles.length === 0 ? (
            <div className="text-muted-foreground">No files uploaded yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {clientFiles.map((file) => (
                <li key={file.name} className="flex items-center justify-between py-2">
                  <div>
                    <span className="font-medium">{file.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{file.size}</span>
                    <span className="ml-2 text-xs text-muted-foreground">Uploaded: {file.uploadedAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" aria-label="Delete" onClick={() => handleDelete(file.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auditor Delivered Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {auditorFiles.length === 0 ? (
            <div className="text-muted-foreground">No documents delivered yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {auditorFiles.map((file) => (
                <li key={file.name} className="flex items-center justify-between py-2">
                  <div>
                    <span className="font-medium">{file.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{file.size}</span>
                    <span className="ml-2 text-xs text-muted-foreground">Delivered: {file.deliveredAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab; 