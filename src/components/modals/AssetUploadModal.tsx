import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  File,
  FolderOpen,
  Tag,
  Globe,
  AlertCircle,
  Loader2,
  Plus,
  Image,
  Database,
  Brain,
  BarChart3
} from 'lucide-react';
import { AssetType, AssetUpload } from '../../types/assets';
import { assetService } from '../../lib/assetService';

interface AssetUploadModalProps {
  onClose: () => void;
  onUpload: (asset: any) => void;
  currentUser: any;
}

const AssetUploadModal: React.FC<AssetUploadModalProps> = ({
  onClose,
  onUpload,
  currentUser: _currentUser
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [assetType, setAssetType] = useState<AssetType>('document');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assetTypes: { value: AssetType; label: string; icon: React.ReactNode }[] = [
    { value: 'document', label: 'Document', icon: <FileText className="w-4 h-4" /> },
    { value: 'report', label: 'Report', icon: <FileText className="w-4 h-4 text-blue-600" /> },
    { value: 'dataset', label: 'Dataset', icon: <Database className="w-4 h-4 text-green-600" /> },
    { value: 'visualization', label: 'Visualization', icon: <BarChart3 className="w-4 h-4 text-purple-600" /> },
    { value: 'ai-output', label: 'AI Output', icon: <Brain className="w-4 h-4 text-pink-600" /> },
    { value: 'image', label: 'Image', icon: <Image className="w-4 h-4 text-gray-600" /> },
    { value: 'presentation', label: 'Presentation', icon: <FileText className="w-4 h-4 text-yellow-600" /> },
    { value: 'spreadsheet', label: 'Spreadsheet', icon: <FileText className="w-4 h-4 text-green-600" /> }
  ];

  const spaces = [
    { id: 'space-1', name: 'Innovation Lab' },
    { id: 'space-2', name: 'Patent Research' },
    { id: 'space-3', name: 'Legal Department' },
    { id: 'space-4', name: 'R&D Team' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Auto-populate name from first file if empty
      if (!name && newFiles.length > 0) {
        setName(newFiles[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
    
    if (!name && droppedFiles.length > 0) {
      setName(droppedFiles[0].name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const validateUpload = (): boolean => {
    const newErrors: string[] = [];
    
    if (files.length === 0) {
      newErrors.push('Please select at least one file to upload');
    }
    
    if (!name.trim()) {
      newErrors.push('Please enter a name for the asset');
    }
    
    // Check file sizes (max 100MB per file)
    const maxSize = 100 * 1024 * 1024;
    files.forEach(file => {
      if (file.size > maxSize) {
        newErrors.push(`${file.name} exceeds maximum file size of 100MB`);
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleUpload = async () => {
    if (!validateUpload()) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Create upload for each file
      for (const file of files) {
        const upload: AssetUpload = {
          file,
          name: files.length === 1 ? name : `${name} - ${file.name}`,
          description,
          type: assetType,
          spaces: selectedSpaces,
          tags,
          isPublic
        };
        
        const asset = await assetService.uploadAsset(upload);
        onUpload(asset);
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(['Failed to upload files. Please try again.']);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload Assets
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                {errors.map((error, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                ))}
              </div>
            )}
            
            {uploading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Uploading Assets...</h3>
                <div className="max-w-xs mx-auto">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 mt-2">{uploadProgress}%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Files
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, DOC, XLS, PNG, JPG up to 100MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Selected Files */}
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                          </div>
                          <button
                            onClick={() => removeFile(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Asset Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {assetTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setAssetType(type.value)}
                        className={`p-2 border rounded-lg transition-colors ${
                          assetType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {type.icon}
                          <span className="text-xs">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter asset name"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Add a description..."
                  />
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add tags..."
                    />
                    <button
                      onClick={addTag}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Spaces */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add to Spaces
                  </label>
                  <div className="space-y-2">
                    {spaces.map(space => (
                      <label key={space.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSpaces.includes(space.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSpaces(prev => [...prev, space.id]);
                            } else {
                              setSelectedSpaces(prev => prev.filter(s => s !== space.id));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <FolderOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{space.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Visibility */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Make this asset public</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6 mt-1">
                    Public assets can be viewed by anyone with the link
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          {!uploading && (
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {files.length > 0 && (
                  <span>{files.length} file(s) selected</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={files.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload {files.length > 1 ? `${files.length} Files` : 'File'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetUploadModal;