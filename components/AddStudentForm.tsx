import React, { useState } from 'react';
import { Save, UserPlus, CheckCircle } from 'lucide-react';
import { db } from '../services/db';
import { CLASS_OPTIONS, ClassOption } from '../types';

interface Props {
  onSuccess: () => void;
}

const AddStudentForm: React.FC<Props> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [standard, setStandard] = useState<ClassOption>('10th');
  const [totalFees, setTotalFees] = useState<string>('');
  const [paidFees, setPaidFees] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalFees) return;

    db.addStudent({
      name,
      standard,
      totalFees: Number(totalFees),
      paidFees: Number(paidFees) || 0,
    });

    setShowSuccess(true);
    setName('');
    setTotalFees('');
    setPaidFees('');
    setTimeout(() => {
      setShowSuccess(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Register New Student</h2>
          <p className="text-gray-500 text-sm">Add student details and fee structure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="e.g. Rahul Sharma"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class / Standard</label>
          <select
            value={standard}
            onChange={(e) => setStandard(e.target.value as ClassOption)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            {CLASS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt} Standard</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Fees (₹)</label>
            <input
              type="number"
              required
              min="0"
              value={totalFees}
              onChange={(e) => setTotalFees(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={paidFees}
              onChange={(e) => setPaidFees(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* Dynamic Due Calculation */}
        <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
          <span className="text-gray-600 font-medium">Calculated Due Amount:</span>
          <span className={`text-lg font-bold ${Number(totalFees) - Number(paidFees) > 0 ? 'text-red-500' : 'text-green-500'}`}>
            ₹ {Math.max(0, Number(totalFees) - Number(paidFees))}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {showSuccess ? (
            <>
              <CheckCircle size={20} />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Save Student Record</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;
