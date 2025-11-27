import React, { useEffect, useState } from 'react';
import { MessageCircle, AlertTriangle, Send, CheckCircle, Clock, PhoneOff } from 'lucide-react';
import { db } from '../services/db';
import { Student } from '../types';

const FeeReminders: React.FC = () => {
  const [dueStudents, setDueStudents] = useState<Student[]>([]);
  const [refreshTick, setRefreshTick] = useState(0); // To force re-render

  useEffect(() => {
    const students = db.getStudents();
    setDueStudents(students.filter(s => (s.totalFees - s.paidFees) > 0));
  }, [refreshTick]);

  const totalPendingAmount = dueStudents.reduce((sum, s) => sum + (s.totalFees - s.paidFees), 0);

  const isReminderSentRecently = (lastSent?: number) => {
    if (!lastSent) return false;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (Date.now() - lastSent) < twentyFourHours;
  };

  const handleSendIndividual = (student: Student) => {
    if (!student.whatsappNumber) {
      alert("No WhatsApp number found for this student.");
      return;
    }

    const dueAmount = student.totalFees - student.paidFees;
    
    // Marathi Message Template
    const message = `नमस्कार पालकांनो, शिवसाधना एज्युकेशन अकॅडमी मध्ये *${student.name}* ची *₹${dueAmount}* फी बाकी आहे. कृपया लवकरात लवकर भरावी ही विनंती. धन्यवाद.`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/91${student.whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(url, '_blank');

    // Update DB with timestamp
    db.updateStudent(student.id, { lastReminderSent: Date.now() });
    
    // Refresh local state
    setRefreshTick(prev => prev + 1);
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
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Pending Dues List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm">Student Name</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Class</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Pending Amount</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">WhatsApp Number</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dueStudents.map(student => {
                const isSent = isReminderSentRecently(student.lastReminderSent);
                const hasNumber = !!student.whatsappNumber;

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{student.name}</td>
                    <td className="p-4 text-gray-600">{student.standard}</td>
                    <td className="p-4 font-bold text-red-500">₹{student.totalFees - student.paidFees}</td>
                    <td className="p-4 text-gray-600 text-sm">
                      {hasNumber ? student.whatsappNumber : <span className="text-gray-400 italic">Not Added</span>}
                    </td>
                    <td className="p-4 text-center">
                      {!hasNumber ? (
                        <button disabled className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-sm w-full opacity-60 cursor-not-allowed">
                          <PhoneOff size={16} />
                          <span>No Number</span>
                        </button>
                      ) : isSent ? (
                        <div className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm w-full">
                          <CheckCircle size={16} />
                          <span>Msg Sent</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleSendIndividual(student)}
                          className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm w-full shadow-sm"
                        >
                          <Send size={16} />
                          <span>Send</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {dueStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
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