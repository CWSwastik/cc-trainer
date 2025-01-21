import React from "react";
import {
  Settings as SettingsIcon,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import type { Settings } from "../types";

interface SettingsProps {
  settings: Settings;
  onReset: () => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Settings: React.FC<SettingsProps> = ({
  onReset,
  onExportData,
  onImportData,
}) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/30">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Settings
        </h2>
      </div>

      <div className="space-y-4">
        <button
          onClick={onExportData}
          className="flex items-center gap-2 w-full justify-center bg-blue-500/80 text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export Data
        </button>

        <div>
          <input
            type="file"
            id="import-data"
            className="hidden"
            accept=".json"
            onChange={onImportData}
          />
          <label
            htmlFor="import-data"
            className="flex items-center gap-2 w-full justify-center bg-green-500/80 text-white px-4 py-2 rounded-lg hover:bg-green-600/80 transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            Import Data
          </label>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 w-full justify-center bg-red-500/80 text-white px-4 py-2 rounded-lg hover:bg-red-600/80 transition-colors mt-6"
        >
          <RefreshCw className="w-5 h-5" />
          Reset All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
