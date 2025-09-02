// Workflow Toolbar - Canvas controls and actions
// Provides zoom, grid, import/export, and other canvas utilities

import React, { useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Grid,
  Download,
  Upload,
  Maximize,
  RotateCcw,
  HelpCircle
} from 'lucide-react';

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
}

interface WorkflowToolbarProps {
  canvasState: CanvasState;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFitToScreen?: () => void;
  onResetView?: () => void;
  readonly?: boolean;
}

export default function WorkflowToolbar({
  canvasState,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onExport,
  onImport,
  onFitToScreen,
  onResetView,
  readonly = false
}: WorkflowToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onImport(event);
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
      {/* Zoom Controls */}
      <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
        <button
          onClick={onZoomOut}
          disabled={canvasState.zoom <= 0.1}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        
        <div className="px-3 py-2 text-sm text-gray-600 border-x border-gray-200 min-w-[60px] text-center">
          {Math.round(canvasState.zoom * 100)}%
        </div>
        
        <button
          onClick={onZoomIn}
          disabled={canvasState.zoom >= 3}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* View Controls */}
      <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
        <button
          onClick={onToggleGrid}
          className={`p-2 hover:bg-gray-50 rounded-l-lg ${
            canvasState.showGrid 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
          title={`${canvasState.showGrid ? 'Hide' : 'Show'} Grid`}
        >
          <Grid size={16} />
        </button>

        {onFitToScreen && (
          <button
            onClick={onFitToScreen}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200"
            title="Fit to Screen"
          >
            <Maximize size={16} />
          </button>
        )}

        {onResetView && (
          <button
            onClick={onResetView}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200 rounded-r-lg"
            title="Reset View"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      {/* File Operations */}
      <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
        <button
          onClick={onExport}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg"
          title="Export Workflow"
        >
          <Download size={16} />
        </button>

        {!readonly && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200 rounded-r-lg"
              title="Import Workflow"
            >
              <Upload size={16} />
            </button>
          </>
        )}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <HelpCircle size={14} />
          <span>Press ? for shortcuts</span>
        </div>
      </div>
    </div>
  );
}