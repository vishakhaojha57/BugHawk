import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import AnalysisStatus from "@/components/AnalysisStatus";
import FindingsView from "@/components/FindingsView";

export default function App() {
  // App flow states: "upload" -> "analyzing" -> "completed"
  const [scanState, setScanState] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState(null);


  const handleFileAccepted = (file) => {
    setUploadedFile(file);
    setScanState("analyzing");
  };


  const handleAnalysisComplete = () => {
    setScanState("completed");
  };


  const handleReset = () => {
    setUploadedFile(null);
    setScanState("upload");
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-10 max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">BugHawk</h1>
        <p className="text-sm text-muted-foreground">
          Static Analysis & AI-Assisted Code Remediation Dashboard
        </p>
      </header>

      {/* State 1: File Dropzone (Upload Stage) */}
      {scanState === "upload" && (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">Upload Codebase</h2>
            <p className="text-sm text-muted-foreground">
              Provide your project archive to scan for security vulnerabilities and code quality issues.
            </p>
          </div>
          <FileDropzone onFileSelect={handleFileAccepted} />
        </section>
      )}

      {/* State 2: Active Scan Progress Banner */}
      {scanState === "analyzing" && (
        <section className="flex flex-col gap-4">
          <AnalysisStatus
            fileName={uploadedFile?.name}
            onComplete={handleAnalysisComplete}
            onReset={handleReset}
          />
        </section>
      )}

      {/* State 3: Completed Analysis Dashboard */}
      {scanState === "completed" && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Inspection Report</h2>
              <p className="text-sm text-muted-foreground">
                Showing static analysis findings for {uploadedFile?.name || "uploaded archive"}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-primary underline underline-offset-4 hover:opacity-80"
            >
              Scan another project
            </button>
          </div>
          <FindingsView />
        </section>
      )}
    </main>
  );
}