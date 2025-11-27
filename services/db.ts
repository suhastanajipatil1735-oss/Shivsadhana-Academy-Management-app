import { Student, CLASS_OPTIONS } from '../types';

const STORAGE_KEY = 'shivsadhana_students_db_v1';

// Seed data to show if empty
const SEED_DATA: Student[] = [
  { id: '1', name: 'Aarav Patil', standard: '10th', totalFees: 25000, paidFees: 15000, createdAt: Date.now() },
  { id: '2', name: 'Vivaan Deshmukh', standard: '9th', totalFees: 22000, paidFees: 22000, createdAt: Date.now() },
  { id: '3', name: 'Aditya Joshi', standard: '10th', totalFees: 25000, paidFees: 5000, createdAt: Date.now() },
  { id: '4', name: 'Vihaan Sawant', standard: '8th', totalFees: 20000, paidFees: 10000, createdAt: Date.now() },
  { id: '5', name: 'Arjun Kulkarni', standard: '5th', totalFees: 15000, paidFees: 0, createdAt: Date.now() },
];

export const db = {
  getStudents: (): Student[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with seed data if empty for demo purposes
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
        return SEED_DATA;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load data", e);
      return [];
    }
  },

  addStudent: (student: Omit<Student, 'id' | 'createdAt'>): Student => {
    const students = db.getStudents();
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updated = [...students, newStudent];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newStudent;
  },

  updateStudent: (id: string, updates: Partial<Omit<Student, 'id' | 'createdAt'>>): Student | null => {
    const students = db.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const updatedStudent = { ...students[index], ...updates };
    students[index] = updatedStudent;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return updatedStudent;
  },

  deleteStudent: (id: string) => {
    const students = db.getStudents();
    const updated = students.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteStudentsByClass: (standard: string) => {
    const students = db.getStudents();
    const updated = students.filter(s => s.standard !== standard);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
  
  // Helpers for charts
  getMetrics: () => {
    const students = db.getStudents();
    return students.reduce((acc, s) => ({
      totalCollected: acc.totalCollected + s.paidFees,
      totalDue: acc.totalDue + (s.totalFees - s.paidFees),
      totalStudents: students.length
    }), { totalCollected: 0, totalDue: 0, totalStudents: 0 });
  },

  getChartData: () => {
    const students = db.getStudents();
    // Aggregate by class
    const data = CLASS_OPTIONS.map(cls => {
      const classStudents = students.filter(s => s.standard === cls);
      const totalFees = classStudents.reduce((sum, s) => sum + s.totalFees, 0);
      const paidFees = classStudents.reduce((sum, s) => sum + s.paidFees, 0);
      return {
        name: cls,
        students: classStudents.length,
        collected: paidFees,
        due: totalFees - paidFees
      };
    });
    return data;
  }
};
