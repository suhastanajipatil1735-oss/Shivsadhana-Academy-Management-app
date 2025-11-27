import React, { useState } from 'react';
import { Trash2, AlertOctagon } from 'lucide-react';
import { db } from '../services/db';
import { CLASS_OPTIONS, ClassOption } from '../types';

interface Props {
  onUpdate: () => void;
}

const RemoveStudents: React.FC<Props> = ({ onUpdate }) => {
  const [selectedClass, setSelectedClass] = useState<ClassOption>('10th');
  const [confirming, setConfirming] = useState(false);

  const handleRemove = () => {
    db.deleteStudentsByClass(selectedClass);
    setConfirming(false);
    onUpdate();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
        <div className="flex items-center space-x-3 text-red-700 mb-4">
          <AlertOctagon size={28} />
          <h2 className="text-xl font-bold">Danger Zone</h2>
        </div>
        
        <p className="text-red-600 mb-6 text-sm">
          This action will permanently delete all student records for the selected class. 
          This cannot be undone. Please be certain.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-red-800 mb-2">Select Class to Clear</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassOption)}
              className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white text-gray-700"
            >
              {CLASS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt} Standard</option>
              ))}
            </select>
          </div>

          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="w-full bg-white border border-red-300 text-red-600 hover:bg-red-50 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 size={18} />
              <span>Remove All Students in {selectedClass}</span>
            </button>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-red-200 animate-pulse-once">
              <p className="text-center font-bold text-gray-800 mb-3">Are you absolutely sure?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Yes, Delete All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveStudents;
