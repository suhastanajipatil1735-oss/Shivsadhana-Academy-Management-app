import React, { useState, useEffect } from 'react';
import { Trash2, UserX, AlertCircle, Check, X } from 'lucide-react';
import { db } from '../services/db';
import { CLASS_OPTIONS, ClassOption, Student } from '../types';

interface Props {
  onUpdate: () => void;
}

const RemoveStudents: React.FC<Props> = ({ onUpdate }) => {
  const [selectedClass, setSelectedClass] = useState<ClassOption>('10th');
  const [students, setStudents] = useState<Student[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Load students whenever class selection changes
  useEffect(() => {
    loadStudents();
  }, [selectedClass]);

  const loadStudents = () => {
    const allStudents = db.getStudents();
    const classStudents = allStudents.filter(s => s.standard === selectedClass);
    setStudents(classStudents);
  };

  const handleDelete = (id: string) => {
    db.deleteStudent(id);
    setDeleteConfirmId(null);
    loadStudents();
    onUpdate(); // Update global app state
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header & Class Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UserX className="text-red-500" />
            Remove Students
          </h2>
          <p className="text-sm text-gray-500">Select a class to manage student removal</p>
        </div>
        
        <div className="w-full md:w-64">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as ClassOption)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700"
          >
            {CLASS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt} Standard</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">
            Student List: {selectedClass} Standard
          </h3>
          <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold">
            {students.length} Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Student Name</th>
                <th className="p-4 font-medium">Fee Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle size={48} className="mb-3 opacity-30" />
                      <p className="font-medium">No students found in {selectedClass} standard.</p>
                      <p className="text-sm opacity-75 mt-1">Add students from the "Add Student" tab.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.id} className="hover:bg-red-50 transition-colors group">
                    <td className="p-4 font-medium text-gray-800">
                      {student.name}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex flex-col">
                         <span className="text-gray-500 text-xs">Due Amount</span>
                         <span className={`font-semibold ${student.totalFees - student.paidFees > 0 ? 'text-red-500' : 'text-green-500'}`}>
                           ₹{student.totalFees - student.paidFees}
                         </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {deleteConfirmId === student.id ? (
                        <div className="flex justify-end items-center space-x-2 animate-fade-in">
                          <span className="text-xs text-red-600 font-bold mr-1">Delete?</span>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm"
                            title="Confirm Delete"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirmId(student.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white hover:shadow-md rounded-lg transition-all"
                          title="Remove Student"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RemoveStudents;