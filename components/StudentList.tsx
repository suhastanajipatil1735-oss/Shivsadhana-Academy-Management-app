import React, { useState, useEffect } from 'react';
import { Search, Edit2, X, Check, Filter, Phone } from 'lucide-react';
import { db } from '../services/db';
import { Student } from '../types';

interface Props {
  onUpdate: () => void;
}

const StudentList: React.FC<Props> = ({ onUpdate }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPaidAmount, setEditPaidAmount] = useState<string>('');

  useEffect(() => {
    setStudents(db.getStudents());
  }, [searchTerm, editingId]); // Re-fetch on simple triggers

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (student: Student) => {
    setEditingId(student.id);
    setEditPaidAmount(student.paidFees.toString());
  };

  const saveEdit = (id: string) => {
    const amount = Number(editPaidAmount);
    if (!isNaN(amount)) {
      db.updateStudent(id, { paidFees: amount });
      setEditingId(null);
      onUpdate(); // Notify parent to refresh other views if needed
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search students by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Class & Medium</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Contact</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Total Fees</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Paid</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Due</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No students found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const due = student.totalFees - student.paidFees;
                  const isEditing = editingId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{student.name}</td>
                      <td className="p-4 text-gray-600">
                        <div className="flex flex-col items-start space-y-1">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold border border-blue-100">
                            {student.standard}
                          </span>
                          {student.medium && (
                            <span className="text-xs text-gray-500">
                              {student.medium}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {student.whatsappNumber ? (
                          <div className="flex items-center text-green-600">
                            <Phone size={14} className="mr-1" />
                            {student.whatsappNumber}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600">₹{student.totalFees}</td>
                      <td className="p-4 text-gray-600">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPaidAmount}
                            onChange={(e) => setEditPaidAmount(e.target.value)}
                            className="w-24 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-green-600 font-medium">₹{student.paidFees}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${due > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          ₹{due}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <div className="flex justify-center space-x-2">
                            <button onClick={() => saveEdit(student.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <Check size={18} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startEditing(student)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;