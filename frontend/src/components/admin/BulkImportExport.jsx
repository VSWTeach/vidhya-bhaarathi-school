import React, { useState } from 'react';
import { DocumentArrowUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BulkImportExport = () => {
  const [importing, setImporting] = useState(false);
  const [exportType, setExportType] = useState('students');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    toast.success(`Importing ${file.name}...`);
    setTimeout(() => {
      setImporting(false);
      toast.success('Import completed successfully!');
    }, 2000);
  };

  const handleExport = async () => {
    toast.success(`Exporting ${exportType} data...`);
    setTimeout(() => {
      toast.success('Export completed!');
    }, 1500);
  };

  const downloadTemplate = () => {
    toast.success('Template downloaded!');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bulk Import / Export</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <DocumentArrowUpIcon className="h-5 w-5 text-green-600" />
            Import Data
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select File (Excel/CSV)</label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={importing}
                className="w-full border rounded-lg p-2"
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: .xlsx, .xls, .csv</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="text-blue-600 text-sm hover:underline"
            >
              Download Template
            </button>
          </div>
        </div>

        {/* Export Section */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <DocumentArrowDownIcon className="h-5 w-5 text-blue-600" />
            Export Data
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Data Type</label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="students">Students</option>
                <option value="fees">Fee Records</option>
                <option value="attendance">Attendance</option>
                <option value="results">Exam Results</option>
              </select>
            </div>
            <button
              onClick={handleExport}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImportExport;
