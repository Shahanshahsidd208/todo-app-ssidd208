import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Trash2, 
  Cloud, 
  Sun, 
  CloudRain, 
  Star,
  Bell,
  Calendar,
  Check,
} from 'lucide-react';
import { 
  deleteTask, 
  toggleTaskComplete, 
  toggleTaskStar, 
  setTaskReminder 
} from '../store/slices/tasksSlice';
import type { RootState } from '../store';
import type { Task } from '../types';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

function filterTasks(tasks: Task[], selectedList: string): Task[] {
  const today = new Date().toISOString().split('T')[0];
  
  return tasks.filter(task => {
    switch (selectedList) {
      case 'today':
        return task.dueDate === today;
      case 'important':
        return task.starred;
      case 'planned':
        return task.dueDate != null;
      case 'assigned':
        return task.assignedTo != null;
      case 'all':
        return true;
      default:
        return true; // Custom lists show all tasks for now
    }
  });
}

export default function TaskList() {
  const { tasks, loading, error, selectedList } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  const filteredTasks = filterTasks(tasks, selectedList);
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No tasks yet. Add some tasks to get started!
      </div>
    );
  }

  const TaskItem = ({ task }: { task: Task }) => (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleTaskComplete(task.id))}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            task.completed 
              ? 'border-indigo-500 bg-indigo-500' 
              : 'border-gray-300 hover:border-indigo-500'
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            {task.weather && (
              <span className="flex items-center">
                {task.weather.condition === 'Clear' && <Sun className="w-4 h-4 mr-1" />}
                {task.weather.condition === 'Clouds' && <Cloud className="w-4 h-4 mr-1" />}
                {task.weather.condition === 'Rain' && <CloudRain className="w-4 h-4 mr-1" />}
                {task.weather.temp}°C - {task.weather.condition}
              </span>
            )}
            
            {task.dueDate && (
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}

            {task.reminder && (
              <span className="flex items-center">
                <Bell className="w-4 h-4 mr-1" />
                {new Date(task.reminder).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTaskStar(task.id))}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              task.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <Star className="w-5 h-5" fill={task.starred ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => {
              const time = prompt('Enter reminder time (YYYY-MM-DD HH:MM):');
              if (time) {
                dispatch(setTaskReminder({ taskId: task.id, reminder: new Date(time).toISOString() }));
              }
            }}
            className="p-1 rounded-full text-gray-400 hover:text-indigo-500 hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
          </button>

          <button
            onClick={() => dispatch(deleteTask(task.id))}
            className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {incompleteTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-500 mb-4">Completed Tasks</h3>
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}