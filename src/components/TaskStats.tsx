import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { RootState } from '../store';

export default function TaskStats() {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = tasks.length - completedTasks;

  const data = [
    { name: 'Completed', value: completedTasks },
    { name: 'Remaining', value: incompleteTasks }
  ];

  const COLORS = isDark 
    ? ['#818cf8', '#374151'] // Dark mode colors
    : ['#4F46E5', '#E5E7EB']; // Light mode colors

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Task Progress</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index]}
                  className="transition-colors duration-200"
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        {completedTasks} of {tasks.length} tasks completed
      </div>
    </div>
  );
}