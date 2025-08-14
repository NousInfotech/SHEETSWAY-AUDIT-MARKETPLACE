import { FileUploadZone } from "@/features/engagements/components/file-manager/FileUploadZone";




export default function FilesOrganizePage() {
  return (
    <main className="container mx-auto p-4 sm:p-8 md:p-12">
      <div className="bg-card/50 p-8 rounded-2xl">
         <FileUploadZone />
      </div>
    </main>
  );
}