import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PlusCircle } from 'lucide-react';
import { addTaskWithWeather } from '../store/slices/tasksSlice';
import type { AppDispatch } from '../store';
import type { Task } from '../types';

export default function TaskInput() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(addTaskWithWeather({ title: title.trim(), priority }));
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>
    </form>
  );
}