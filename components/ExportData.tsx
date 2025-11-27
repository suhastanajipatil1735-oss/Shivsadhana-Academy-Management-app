import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, FileText } from 'lucide-react';
import { db } from '../services/db';
import { CLASS_OPTIONS, ClassOption, Student } from '../types';

const ExportData: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassOption | 'All'>('All');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const allStudents = db.getStudents();
    if (selectedClass === 'All') {
      setStudents(allStudents);
    } else {
      setStudents(allStudents.filter(s => s.standard === selectedClass));
    }
  }, [selectedClass]);

  const handleExport = () => {
    if (students.length === 0) return;

    // 1. Define Headers
    const headers = ['Student Name', 'Standard', 'WhatsApp Number', 'Total Fees', 'Paid Fees', 'Due Amount'];

    // 2. Format Data Rows
    const rows = students.map(s => [
      `"${s.name}"`, // Quote strings to handle commas in names
      s.standard,
      s.whatsappNumber || '-',
      s.totalFees,
      s.paidFees,
      s.totalFees - s.paidFees
    ]);

    // 3. Combine into CSV String
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 4. Create Blob and Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // File name: Shivsadhana_10th_27-11-2024.csv
    const dateStr = new Date().toLocaleDateString('en-IN').replace(/\//g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `Shivsadhana_${selectedClass}_Students_${dateStr}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-green-100 text-green-700 rounded-full">
          <FileSpreadsheet size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Export Student Data</h2>
          <p className="text-sm text-gray-500">Download student records and fee details in Excel (CSV) format</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Select Class to Export</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassOption | 'All')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white text-lg text-gray-800"
            >
              <option value="All">All Classes</option>
              {CLASS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt} Standard</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Selected: <span className="font-bold text-gray-800">{students.length}</span> records found.
            </p>
          </div>

          <div className="flex flex-col justify-center items-start md:items-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             <FileText className="text-gray-400 mb-2" size={40} />
             <p className="text-gray-600 font-medium mb-4">
               {students.length > 0 
                 ? `Ready to export ${students.length} rows` 
                 : 'No data available to export'}
             </p>
             
             <button
              onClick={handleExport}
              disabled={students.length === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 shadow-lg
                ${students.length > 0 
                  ? 'bg-green-600 hover:bg-green-700 hover:shadow-green-200' 
                  : 'bg-gray-300 cursor-not-allowed'}`}
             >
               <Download size={20} />
               <span>Download Excel File</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExportData;