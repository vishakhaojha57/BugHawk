import React, { useState, useRef } from "react";
import { UploadCloud, FileArchive, AlertCircle, X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const VALID_TYPES = ["application/zip", "application/x-zip-compressed"];

export default function FileDropzone({ onFileSelect }) {
  const [dragState, setDragState] = useState("idle"); // idle, dragOver, selected, error
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateAndProcessFile = (selectedFile) => {
    if (!selectedFile) return;

    const isZipExtension = selectedFile.name.toLowerCase().endsWith(".zip");
    const isZipType = VALID_TYPES.includes(selectedFile.type);

    // Some OS might not correctly set mime type for zip files, so we check both extension and type.
    if (!isZipExtension && !isZipType) {
      setFile(null);
      setErrorMsg("Invalid file type. Please upload a .zip file.");
      setDragState("error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setErrorMsg(`File size exceeds 25MB limit. Your file is ${formatSize(selectedFile.size)}.`);
      setDragState("error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
    setErrorMsg("");
    setDragState("selected");
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragState !== "selected") {
      setDragState("dragOver");
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragState === "dragOver") {
      setDragState("idle");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragState !== "selected") {
      setDragState("dragOver");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragState === "selected") return; // Allow user to click 'remove' instead of accidental overwrite

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      validateAndProcessFile(droppedFiles[0]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      validateAndProcessFile(selectedFiles[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    setErrorMsg("");
    setDragState("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <div
        className={`relative w-full rounded-lg border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-colors duration-200 cursor-pointer
          ${
            dragState === "dragOver"
              ? "border-primary bg-primary/10"
              : dragState === "selected"
              ? "border-muted bg-muted/5 cursor-default"
              : dragState === "error"
              ? "border-destructive bg-destructive/10"
              : "border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/50"
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={dragState !== "selected" ? handleClick : undefined}
      >
        <input
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {dragState === "selected" && file ? (
          <div className="flex items-center justify-between w-full max-w-md bg-background border p-4 rounded-md shadow-sm">
            <div className="flex items-center space-x-4 overflow-hidden">
              <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                <FileArchive className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
              onClick={handleRemove}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
              <UploadCloud className={`h-8 w-8 ${dragState === "dragOver" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-base font-medium">
                Drag & drop your codebase .zip here, or browse files
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Only .zip files up to 25MB
              </p>
            </div>
          </div>
        )}
      </div>

      {dragState === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
