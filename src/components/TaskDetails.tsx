import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  Plus,
  Calendar,
  Bell,
  Repeat,
  StickyNote,
  X,
  Check,
  Trash
} from 'lucide-react';
import { 
  addTaskStep,
  toggleTaskStep,
  deleteTaskStep,
  updateTaskDueDate,
  updateTaskReminder,
  updateTaskRepeat,
  updateTaskNotes,
  deleteTask
} from '../store/slices/tasksSlice';
import type { RootState } from '../store';
import type { Task } from '../types';

export default function TaskDetails() {
  const [newStep, setNewStep] = useState('');
  const dispatch = useDispatch();
  const selectedTaskId = useSelector((state: RootState) => state.tasks.selectedTask);
  const task = useSelector((state: RootState) => 
    state.tasks.tasks.find(t => t.id === selectedTaskId)
  );

  if (!task) return null;

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStep.trim()) {
      dispatch(addTaskStep({ taskId: task.id, title: newStep.trim() }));
      setNewStep('');
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
        <button
          onClick={() => dispatch(deleteTask(task.id))}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Steps */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Steps</h3>
          <form onSubmit={handleAddStep} className="mb-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Add step"
                className="flex-1 px-3 py-1 text-sm border rounded"
              />
              <button
                type="submit"
                className="p-1 text-gray-400 hover:text-indigo-500"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="space-y-2">
            {task.steps.map(step => (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(toggleTaskStep({ taskId: task.id, stepId: step.id }))}
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    step.completed 
                      ? 'border-indigo-500 bg-indigo-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {step.completed && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className={step.completed ? 'line-through text-gray-500' : ''}>
                  {step.title}
                </span>
                <button
                  onClick={() => dispatch(deleteTaskStep({ taskId: task.id, stepId: step.id }))}
                  className="ml-auto text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Due Date</h3>
          <DatePicker
            selected={task.dueDate ? new Date(task.dueDate) : null}
            onChange={(date) => dispatch(updateTaskDueDate({ 
              taskId: task.id, 
              dueDate: date ? date.toISOString() : null 
            }))}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full px-3 py-2 border rounded"
            placeholderText="Set due date"
          />
        </div>

        {/* Reminder */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Reminder</h3>
          <DatePicker
            selected={task.reminder ? new Date(task.reminder) : null}
            onChange={(date) => dispatch(updateTaskReminder({ 
              taskId: task.id, 
              reminder: date ? date.toISOString() : null 
            }))}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full px-3 py-2 border rounded"
            placeholderText="Set reminder"
          />
        </div>

        {/* Repeat */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Repeat</h3>
          <select
            value={task.repeat || 'none'}
            onChange={(e) => dispatch(updateTaskRepeat({ 
              taskId: task.id, 
              repeat: e.target.value as Task['repeat'] 
            }))}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="none">Don't repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
          <textarea
            value={task.notes || ''}
            onChange={(e) => dispatch(updateTaskNotes({ 
              taskId: task.id, 
              notes: e.target.value 
            }))}
            placeholder="Add notes"
            className="w-full px-3 py-2 border rounded resize-none"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}