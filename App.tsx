import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, UserPlus, Users, MessageCircle, Trash2, LogOut, Menu, X 
} from 'lucide-react';

import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import AddStudentForm from './components/AddStudentForm';
import StudentList from './components/StudentList';
import FeeReminders from './components/FeeReminders';
import RemoveStudents from './components/RemoveStudents';
import { db } from './services/db';

type Screen = 'dashboard' | 'add' | 'list' | 'reminders' | 'remove';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'auth' | 'app'>('splash');
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Simple counter to force refresh

  // Force re-renders when data changes
  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  if (appState === 'splash') {
    return <SplashScreen onComplete={() => setAppState('auth')} />;
  }

  if (appState === 'auth') {
    return <LoginScreen onLogin={() => setAppState('app')} />;
  }

  const NavItem = ({ screen, icon: Icon, label }: { screen: Screen, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentScreen(screen);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        currentScreen === screen 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-blue-900">Shivsadhana</h1>
              <p className="text-xs text-blue-400 font-medium tracking-wider">EDUCATION ACADEMY</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem screen="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem screen="add" icon={UserPlus} label="Add Student" />
            <NavItem screen="list" icon={Users} label="Student List" />
            <NavItem screen="reminders" icon={MessageCircle} label="Fee Reminders" />
            <div className="pt-4 mt-4 border-t border-gray-100">
              <NavItem screen="remove" icon={Trash2} label="Remove Class" />
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setAppState('auth')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between lg:hidden sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-800">
            {currentScreen === 'dashboard' && 'Overview'}
            {currentScreen === 'add' && 'New Admission'}
            {currentScreen === 'list' && 'Student Records'}
            {currentScreen === 'reminders' && 'WhatsApp Reminders'}
            {currentScreen === 'remove' && 'Batch Removal'}
          </span>
          <div className="w-10" /> {/* Spacer for balance */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Header Title */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentScreen === 'dashboard' && 'Dashboard Overview'}
                {currentScreen === 'add' && 'New Student Admission'}
                {currentScreen === 'list' && 'Student Records Directory'}
                {currentScreen === 'reminders' && 'Fee Collection Reminders'}
                {currentScreen === 'remove' && 'Bulk Student Removal'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Manage your academy fees and students efficiently.</p>
            </div>

            {/* Content Screens */}
            <div key={refreshTrigger}> 
              {currentScreen === 'dashboard' && <Dashboard />}
              {currentScreen === 'add' && <AddStudentForm onSuccess={() => {
                triggerRefresh();
                setCurrentScreen('dashboard');
              }} />}
              {currentScreen === 'list' && <StudentList onUpdate={triggerRefresh} />}
              {currentScreen === 'reminders' && <FeeReminders />}
              {currentScreen === 'remove' && <RemoveStudents onUpdate={triggerRefresh} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
