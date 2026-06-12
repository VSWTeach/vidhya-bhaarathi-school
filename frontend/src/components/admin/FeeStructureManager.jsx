import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FeeStructureManager = () => {
  const [feeStructure, setFeeStructure] = useState([
    { class: 'Pre-Nursery', admission: 5000, tuition: 35000, exam: 2000, transport: 12000, total: 54000 },
    { class: 'Nursery', admission: 5000, tuition: 38000, exam: 2000, transport: 12000, total: 57000 },
    { class: 'KG', admission: 5000, tuition: 40000, exam: 2000, transport: 12000, total: 59000 },
    { class: '1', admission: 5000, tuition: 45000, exam: 2500, transport: 15000, total: 67500 },
    { class: '2', admission: 5000, tuition: 48000, exam: 2500, transport: 15000, total: 70500 },
    { class: '3', admission: 5000, tuition: 52000, exam: 2500, transport: 15000, total: 74500 },
    { class: '4', admission: 5000, tuition: 55000, exam: 3000, transport: 15000, total: 78000 },
    { class: '5', admission: 5000, tuition: 58000, exam: 3000, transport: 15000, total: 81000 },
    { class: '6', admission: 5000, tuition: 62000, exam: 3000, transport: 18000, total: 88000 },
    { class: '7', admission: 5000, tuition: 65000, exam: 3500, transport: 18000, total: 91500 },
    { class: '8', admission: 5000, tuition: 68000, exam: 3500, transport: 18000, total: 94500 },
    { class: '9', admission: 5000, tuition: 72000, exam: 4000, transport: 20000, total: 101000 },
    { class: '10', admission: 5000, tuition: 75000, exam: 4000, transport: 20000, total: 104000 },
    { class: '11-Science', admission: 5000, tuition: 85000, exam: 5000, transport: 20000, total: 115000 },
    { class: '11-Commerce', admission: 5000, tuition: 80000, exam: 5000, transport: 20000, total: 110000 },
    { class: '12-Science', admission: 5000, tuition: 85000, exam: 5000, transport: 20000, total: 115000 },
    { class: '12-Commerce', admission: 5000, tuition: 80000, exam: 5000, transport: 20000, total: 110000 },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (index, item) => {
    setEditingId(index);
    setEditData({ ...item });
  };

  const handleSave = async (index) => {
    try {
      const newStructure = [...feeStructure];
      newStructure[index] = editData;
      setFeeStructure(newStructure);
      setEditingId(null);
      toast.success('Fee structure updated successfully!');
    } catch (error) {
      toast.error('Failed to update fee structure');
    }
  };

  const calculateTotal = (item) => {
    return item.admission + item.tuition + item.exam + item.transport;
  };

  const exportToCSV = () => {
    const headers = ['Class', 'Admission Fee', 'Tuition Fee', 'Exam Fee', 'Transport Fee', 'Total'];
    const csvData = feeStructure.map(item => [
      item.class,
      item.admission,
      item.tuition,
      item.exam,
      item.transport,
      item.admission + item.tuition + item.exam + item.transport
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fee_structure.csv';
    a.click();
    toast.success('Fee structure exported!');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fee Structure Manager</h2>
          <p className="text-sm text-gray-500">Manage class-wise fee breakdown</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          Export to CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuition (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transport (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {feeStructure.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {editingId === index ? (
                  <>
                    <td className="px-4 py-2 font-medium">{item.class}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editData.admission}
                        onChange={(e) => setEditData({...editData, admission: parseInt(e.target.value)})}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editData.tuition}
                        onChange={(e) => setEditData({...editData, tuition: parseInt(e.target.value)})}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editData.exam}
                        onChange={(e) => setEditData({...editData, exam: parseInt(e.target.value)})}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editData.transport}
                        onChange={(e) => setEditData({...editData, transport: parseInt(e.target.value)})}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 font-bold">₹{calculateTotal(editData).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleSave(index)} className="text-green-600 mr-2">
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-red-600">
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 font-medium">{item.class}</td>
                    <td className="px-4 py-2">₹{item.admission.toLocaleString()}</td>
                    <td className="px-4 py-2">₹{item.tuition.toLocaleString()}</td>
                    <td className="px-4 py-2">₹{item.exam.toLocaleString()}</td>
                    <td className="px-4 py-2">₹{item.transport.toLocaleString()}</td>
                    <td className="px-4 py-2 font-bold">₹{calculateTotal(item).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleEdit(index, item)} className="text-blue-600">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeStructureManager;
