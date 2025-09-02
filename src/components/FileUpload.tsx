import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, FileSpreadsheet, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, content: string) => void;
  onRemove?: () => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

interface UploadedFile {
  file: File;
  content: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  onRemove,
  maxSize = 10, 
  acceptedTypes = ['.xlsx', '.xls', '.csv', '.txt', '.json'],
  className = ''
}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const processFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (!content) {
          reject(new Error('Failed to read file content'));
          return;
        }
        
        // For CSV/Excel files, we'll pass the raw content
        // The AI service will handle parsing
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      // Read as text for CSV/TXT, as binary for Excel
      if (file.name.toLowerCase().endsWith('.csv') || 
          file.name.toLowerCase().endsWith('.txt') ||
          file.name.toLowerCase().endsWith('.json')) {
        reader.readAsText(file);
      } else {
        // For Excel files, read as binary and convert to base64
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (arrayBuffer) {
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            resolve(base64);
          } else {
            reject(new Error('Failed to read Excel file'));
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleFileSelection = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadedFile({ file, content: '', status: 'error', error });
      return;
    }

    setUploadedFile({ file, content: '', status: 'uploading' });

    try {
      const content = await processFile(file);
      const successFile = { file, content, status: 'success' as const };
      setUploadedFile(successFile);
      onFileSelect(file, content);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process file';
      setUploadedFile({ file, content: '', status: 'error', error: errorMsg });
    }
  }, [onFileSelect, maxSize, acceptedTypes]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]); // Only handle the first file
    }
  }, [handleFileSelection]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, [handleFileSelection]);

  const handleRemove = useCallback(() => {
    setUploadedFile(null);
    onRemove?.();
  }, [onRemove]);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      case 'txt':
      case 'json':
        return <FileText className="h-8 w-8 text-blue-600" />;
      default:
        return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadedFile) {
    return (
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getFileIcon(uploadedFile.file.name)}
            <div>
              <p className="text-sm font-medium text-gray-900">{uploadedFile.file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {uploadedFile.status === 'uploading' && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            )}
            {uploadedFile.status === 'success' && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {uploadedFile.status === 'error' && (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <button
              onClick={handleRemove}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        {uploadedFile.status === 'error' && uploadedFile.error && (
          <p className="mt-2 text-xs text-red-600">{uploadedFile.error}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed ${
        isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      } rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${className}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Drop your file here, or{' '}
          <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
            browse
            <input
              type="file"
              className="hidden"
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports: {acceptedTypes.join(', ')} (max {maxSize}MB)
        </p>
      </div>
    </div>
  );
};

export default FileUpload;