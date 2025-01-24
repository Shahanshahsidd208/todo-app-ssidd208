import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ListTodo, 
  Calendar, 
  Star, 
  Clock, 
  UserCircle,
  PlusCircle,
  ChevronDown,
  Trash2,
  StickyNote
} from 'lucide-react';
import { setSelectedList, addList, deleteList } from '../store/slices/tasksSlice';
import type { RootState } from '../store';
import TaskStats from './TaskStats';

export default function Sidebar() {
  const [newListName, setNewListName] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedList, lists } = useSelector((state: RootState) => state.tasks);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      dispatch(addList(newListName.trim()));
      setNewListName('');
      setIsAddingList(false);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <UserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          )}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <button
          onClick={() => dispatch(setSelectedList('all'))}
          className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${
            selectedList === 'all' 
              ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <ListTodo className="w-5 h-5" />
          <span>All Tasks</span>
        </button>

        <button
          onClick={() => dispatch(setSelectedList('today'))}
          className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${
            selectedList === 'today'
              ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Today</span>
        </button>

        <button
          onClick={() => dispatch(setSelectedList('important'))}
          className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${
            selectedList === 'important'
              ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <Star className="w-5 h-5" />
          <span>Important</span>
        </button>

        <button
          onClick={() => dispatch(setSelectedList('planned'))}
          className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${
            selectedList === 'planned'
              ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Planned</span>
        </button>

        <button
          onClick={() => dispatch(setSelectedList('assigned'))}
          className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${
            selectedList === 'assigned'
              ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <UserCircle className="w-5 h-5" />
          <span>Assigned to me</span>
        </button>

        <div className="pt-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">My Lists</h3>
            <button
              onClick={() => setIsAddingList(!isAddingList)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          {isAddingList && (
            <form onSubmit={handleAddList} className="px-2 mb-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoFocus
              />
            </form>
          )}

          {lists.map((list) => (
            <div
              key={list.id}
              className={`flex items-center px-2 py-2 rounded-md ${
                selectedList === list.id
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <button
                onClick={() => dispatch(setSelectedList(list.id))}
                className="flex items-center space-x-2 flex-1"
              >
                <ChevronDown className="w-5 h-5" />
                <span>{list.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({list.taskCount})</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const notes = prompt('Add notes for list:');
                    if (notes) {
                      // Add notes functionality here
                    }
                  }}
                  className="text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  <StickyNote className="w-4 h-4" />
                </button>
                {list.taskCount === 0 && (
                  <button
                    onClick={() => dispatch(deleteList(list.id))}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <TaskStats />
      </div>
    </div>
  );
}