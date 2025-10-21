import React, { useState } from "react";
import { useSavedConfigs } from "../context/useSavedConfigs";
import type { PostConfig } from "../types/config";
import { Trash2, Edit3, Download, Copy, Upload, FileDown } from "lucide-react";

interface SavedConfigsProps {
  onLoadConfig: (config: PostConfig) => void;
}

const SavedConfigs: React.FC<SavedConfigsProps> = ({ onLoadConfig }) => {
  const { savedConfigs, deleteConfig, renameConfig } = useSavedConfigs();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const handleExportConfig = (config: PostConfig) => {
    try {
      const configToExport = {
        ...config,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };

      const blob = new Blob([JSON.stringify(configToExport, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `insta-post-config-${config.name
        .replace(/\s+/g, "-")
        .toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export config:", error);
      alert("Failed to export configuration. Please try again.");
    }
  };

  const handleExportAllConfigs = () => {
    try {
      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        configs: savedConfigs,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `insta-post-configs-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export configs:", error);
      alert("Failed to export configurations. Please try again.");
    }
  };

  const handleImportConfigs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const importedData = JSON.parse(result);

        // Handle both single config and backup file formats
        const configsToImport = importedData.configs || [importedData];

        // Filter out configs that already exist (by name) to avoid duplicates
        const existingNames = new Set(
          savedConfigs.map((config) => config.name)
        );
        const newConfigs = configsToImport.filter(
          (config: PostConfig) => !existingNames.has(config.name)
        );

        if (newConfigs.length === 0) {
          alert(
            "No new configurations to import. All configurations already exist."
          );
          return;
        }

        // Add imported configs to the current configs
        const updatedConfigs = [...savedConfigs, ...newConfigs];
        localStorage.setItem(
          "insta_post_saved_configs",
          JSON.stringify(updatedConfigs)
        );

        // Force a re-render by updating the context
        window.location.reload();
      } catch (error) {
        console.error("Failed to import configs:", error);
        alert("Failed to import configurations. Please check the file format.");
      }
    };

    reader.readAsText(file);
    // Reset the input
    event.target.value = "";
  };

  const handleDelete = (configId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this saved configuration?"
      )
    ) {
      deleteConfig(configId);
    }
  };

  const handleRename = (configId: string) => {
    if (editingName.trim()) {
      renameConfig(configId, editingName.trim());
      setEditingId(null);
      setEditingName("");
    }
  };

  const startEditing = (config: PostConfig) => {
    setEditingId(config.id!);
    setEditingName(config.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (savedConfigs.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          No Saved Configurations
        </h3>
        <p className="text-slate-400 text-sm">
          Save your current post configuration to quickly reuse it later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-white">
          Saved Configurations
        </h3>
        <div className="flex items-center space-x-2 gap-2">
          <button
            onClick={handleExportAllConfigs}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
            title="Export all configurations as backup"
          >
            <FileDown size={14} />
            <span>Export All</span>
          </button>
          <label className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors cursor-pointer gap-2">
            <Upload size={14} />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfigs}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {savedConfigs.map((config) => (
          <div
            key={config.id}
            className="bg-slate-700 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              {editingId === config.id ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 bg-slate-600 text-white text-sm px-2 py-1 rounded"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(config.id!);
                      if (e.key === "Escape") cancelEditing();
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleRename(config.id!)}
                    className="text-green-400 hover:text-green-300 text-sm px-2 py-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-slate-400 hover:text-slate-300 text-sm px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h4 className="text-white font-medium text-sm flex-1">
                    {config.name}
                  </h4>
                  <div className="flex items-center space-x-1 gap-2">
                    <button
                      onClick={() => startEditing(config)}
                      className="text-slate-400 hover:text-slate-300 p-1"
                      title="Rename"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(config.id!)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="text-xs text-slate-400 mb-3">
              <span className="capitalize">{config.template}</span> •{" "}
              <span className="capitalize">{config.theme}</span> •{" "}
              {formatDate(config.createdAt!)}
            </div>

            <div className="flex items-center space-x-2 gap-2">
              <button
                onClick={() => onLoadConfig(config)}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
              >
                <Download size={12} />
                <span>Load</span>
              </button>

              <button
                onClick={() => handleExportConfig(config)}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
                title="Export this configuration"
              >
                <FileDown size={12} />
                <span>Export</span>
              </button>

              <button
                onClick={() => {
                  const configText = `Title: ${config.title}\nContent: ${config.content}\nTheme: ${config.theme}\nTemplate: ${config.template}`;
                  navigator.clipboard.writeText(configText);
                  // You could add a toast notification here
                }}
                className="flex items-center space-x-1 bg-slate-600 hover:bg-slate-500 text-white text-xs px-3 py-1 rounded transition-colors"
                title="Copy config details"
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              <div>Title: "{config.title}"</div>
              <div>
                Content: "
                {config.content.length > 50
                  ? config.content.substring(0, 50) + "..."
                  : config.content}
                "
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedConfigs;
