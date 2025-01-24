import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Sun, Moon } from 'lucide-react';
import { logout } from './store/slices/authSlice';
import { toggleTheme } from './store/slices/themeSlice';
import type { RootState } from './store';
import LoginForm from './components/LoginForm';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';
import TaskDetails from './components/TaskDetails';

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const selectedTask = useSelector((state: RootState) => state.tasks.selectedTask);
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      
      <div className="flex-1">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => dispatch(logout())}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1">
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              <TaskInput />
              <TaskList />
            </div>
          </div>
          {selectedTask && <TaskDetails />}
        </main>
      </div>
    </div>
  );
}

export default App;