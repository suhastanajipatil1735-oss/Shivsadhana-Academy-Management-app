import React, { useEffect, useState } from 'react';
import { MessageCircle, AlertTriangle, Send } from 'lucide-react';
import { db } from '../services/db';
import { Student } from '../types';

const FeeReminders: React.FC = () => {
  const [dueStudents, setDueStudents] = useState<Student[]>([]);

  useEffect(() => {
    const students = db.getStudents();
    setDueStudents(students.filter(s => (s.totalFees - s.paidFees) > 0));
  }, []);

  const totalPendingAmount = dueStudents.reduce((sum, s) => sum + (s.totalFees - s.paidFees), 0);

  const handleSendWhatsApp = () => {
    if (dueStudents.length === 0) return;

    // Construct the message
    let message = `*Shivsadhana Education Academy - Fees Reminder*\n\nTotal Pending: ₹${totalPendingAmount}\n\nList of students with pending dues:\n`;
    
    dueStudents.forEach((s, index) => {
      const due = s.totalFees - s.paidFees;
      message += `${index + 1}. ${s.name} (${s.standard}): ₹${due}\n`;
    });

    message += `\nPlease update the records or follow up accordingly.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "919834252755";
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl flex items-start space-x-4">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Pending Fees Overview</h3>
          <p className="text-gray-600 mt-1">
            There are <strong>{dueStudents.length}</strong> students with pending fees, totaling <strong className="text-red-600">₹{totalPendingAmount}</strong>.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-semibold text-gray-700">Pending Dues List</h3>
          <button 
            onClick={handleSendWhatsApp}
            disabled={dueStudents.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              dueStudents.length === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
            }`}
          >
            <MessageCircle size={18} />
            <span>Send Reminder via WhatsApp</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm">Student Name</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Class</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Pending Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dueStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{student.name}</td>
                  <td className="p-4 text-gray-600">{student.standard}</td>
                  <td className="p-4 font-bold text-red-500">₹{student.totalFees - student.paidFees}</td>
                </tr>
              ))}
              {dueStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    Excellent! No pending dues.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeeReminders;
