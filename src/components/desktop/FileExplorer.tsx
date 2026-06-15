import { useState, useEffect, useRef } from "react";

export interface FileItem {
  name: string;
  type: "folder" | "txt" | "bmp" | "dll" | "lnk" | "ini";
  content?: string;
  size?: string;
  originalPath?: string;
  dateDeleted?: string;
}

interface FileExplorerProps {
  currentPath: string[];
  onNavigate: (newPath: string[]) => void;
  files: Record<string, FileItem[]>;
  onDeleteFile: (path: string[], file: FileItem) => void;
  onOpenFile: (file: FileItem) => void;
}

export function FileExplorer({
  currentPath,
  onNavigate,
  files,
  onDeleteFile,
  onOpenFile,
}: FileExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: FileItem;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathString = currentPath.join("\\");
  const currentItems = files[pathString] || [];

  // Handle outside click to deselect / close context menu
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (contextMenu && !(e.target as HTMLElement).closest(".context-menu")) {
        setContextMenu(null);
      }
    };
    window.addEventListener("mousedown", handleOutside);
    return () => window.removeEventListener("mousedown", handleOutside);
  }, [contextMenu]);

  // Handle Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedFile) {
        onDeleteFile(currentPath, selectedFile);
        setSelectedFile(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFile, currentPath, onDeleteFile]);

  const handleBack = () => {
    if (currentPath.length > 1) {
      const next = [...currentPath];
      next.pop();
      onNavigate(next);
      setSelectedFile(null);
    }
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === "folder") {
      onNavigate([...currentPath, file.name]);
      setSelectedFile(null);
    } else {
      onOpenFile(file);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    setSelectedFile(file);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file,
    });
  };

  const getIcon = (type: FileItem["type"]) => {
    switch (type) {
      case "folder":
        return "📁";
      case "txt":
        return "📄";
      case "bmp":
        return "🎨";
      case "dll":
        return "⚙️";
      case "lnk":
        return "shortcut 🔗";
      case "ini":
        return "⚙️";
      default:
        return "📄";
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-window text-[11px] font-sans relative"
      onClick={() => setSelectedFile(null)}
    >
      {/* Top Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-[color:var(--border-dark)] bg-window select-none">
        <button
          onClick={handleBack}
          disabled={currentPath.length <= 1}
          className="win-btn flex items-center gap-0.5 px-2 py-0.5"
        >
          <span>⬅️</span> Back
        </button>
        <button
          onClick={handleBack}
          disabled={currentPath.length <= 1}
          className="win-btn flex items-center gap-0.5 px-2 py-0.5"
        >
          <span>⬆️</span> Up
        </button>
        <div className="w-px h-4 bg-gray-400 mx-1" />
        <span className="text-gray-700">Address:</span>
        <input
          type="text"
          value={pathString}
          readOnly
          className="flex-1 bevel-thin-in px-1 bg-white text-black outline-none h-[20px]"
        />
      </div>

      {/* Main Files Grid */}
      <div className="flex-1 overflow-auto bg-white p-2 select-none">
        {currentItems.length === 0 ? (
          <div className="text-gray-400 text-center py-8">This folder is empty.</div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {currentItems.map((file) => {
              const isSelected = selectedFile?.name === file.name;
              return (
                <div
                  key={file.name}
                  onDoubleClick={() => handleDoubleClick(file)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(file);
                  }}
                  onContextMenu={(e) => handleContextMenu(e, file)}
                  className={`flex flex-col items-center p-1 cursor-default text-center rounded border border-transparent ${
                    isSelected
                      ? "bg-titlebar text-titlebar-foreground border-dotted border-gray-400"
                      : "hover:bg-gray-100"
                  }`}
                  style={{ minWidth: "60px" }}
                >
                  <div className="text-3xl mb-1 leading-none">{getIcon(file.type)}</div>
                  <div className="break-all leading-tight text-[11px] px-0.5">
                    {file.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-[color:var(--border-dark)] bg-window p-1 flex justify-between select-none text-[10px]">
        <span>{currentItems.length} object(s)</span>
        {selectedFile && (
          <span className="font-semibold">
            Selected: {selectedFile.name} ({selectedFile.size || "Unknown size"})
          </span>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu absolute bevel-out bg-window p-0.5 z-[9999] shadow-md flex flex-col w-28"
          style={{ top: contextMenu.y - 40, left: contextMenu.x - 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              handleDoubleClick(contextMenu.file);
              setContextMenu(null);
            }}
            className="text-left px-2 py-0.5 hover:bg-titlebar hover:text-titlebar-foreground w-full"
          >
            Open
          </button>
          <button
            onClick={() => {
              onDeleteFile(currentPath, contextMenu.file);
              setContextMenu(null);
              setSelectedFile(null);
            }}
            className="text-left px-2 py-0.5 hover:bg-titlebar hover:text-titlebar-foreground w-full"
          >
            Delete
          </button>
          <div className="border-t border-gray-400 my-0.5" />
          <button
            onClick={() => {
              alert(
                `Properties of ${contextMenu.file.name}:\nType: ${contextMenu.file.type.toUpperCase()} File\nSize: ${
                  contextMenu.file.size || "Unknown"
                }`
              );
              setContextMenu(null);
            }}
            className="text-left px-2 py-0.5 hover:bg-titlebar hover:text-titlebar-foreground w-full"
          >
            Properties
          </button>
        </div>
      )}
    </div>
  );
}
