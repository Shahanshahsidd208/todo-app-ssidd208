import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Task, TasksState, List } from '../../types';

const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  selectedList: 'all',
  lists: [],
  selectedTask: null,
};

export const addTaskWithWeather = createAsyncThunk(
  'tasks/addTaskWithWeather',
  async ({ title, priority, dueDate, reminder }: { 
    title: string; 
    priority: Task['priority']; 
    dueDate?: string;
    reminder?: string;
  }) => {
    try {
      const lat = '40.7128';
      const lon = '-74.0060';
      
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );

      const task: Task = {
        id: Date.now().toString(),
        title,
        priority,
        createdAt: new Date().toISOString(),
        completed: false,
        starred: false,
        dueDate,
        reminder,
        steps: [],
        weather: {
          temp: weatherResponse.data.main.temp,
          condition: weatherResponse.data.weather[0].main,
          icon: weatherResponse.data.weather[0].icon,
        },
      };

      return task;
    } catch (error) {
      const task: Task = {
        id: Date.now().toString(),
        title,
        priority,
        createdAt: new Date().toISOString(),
        completed: false,
        starred: false,
        dueDate,
        reminder,
        steps: [],
      };
      return task;
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      // Update task count for the list
      if (state.selectedList !== 'all' && state.selectedList !== 'today' && 
          state.selectedList !== 'important' && state.selectedList !== 'planned' && 
          state.selectedList !== 'assigned') {
        const list = state.lists.find(l => l.id === state.selectedList);
        if (list) {
          list.taskCount = state.tasks.filter(t => t.listId === list.id).length;
          // If no tasks left in the list, remove it
          if (list.taskCount === 0) {
            state.lists = state.lists.filter(l => l.id !== list.id);
            state.selectedList = 'all';
          }
        }
      }
    },
    toggleTaskComplete: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : undefined;
      }
    },
    toggleTaskStar: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.starred = !task.starred;
      }
    },
    setTaskReminder: (state, action) => {
      const { taskId, reminder } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.reminder = reminder;
      }
    },
    setSelectedList: (state, action) => {
      state.selectedList = action.payload;
    },
    addList: (state, action) => {
      const newList: List = {
        id: Date.now().toString(),
        name: action.payload,
        createdAt: new Date().toISOString(),
        taskCount: 0,
      };
      state.lists.push(newList);
      state.selectedList = newList.id;
    },
    deleteList: (state, action) => {
      state.lists = state.lists.filter(list => list.id !== action.payload);
      if (state.selectedList === action.payload) {
        state.selectedList = 'all';
      }
      // Remove tasks associated with the deleted list
      state.tasks = state.tasks.filter(task => task.listId !== action.payload);
    },
    addTaskStep: (state, action) => {
      const { taskId, title } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.steps.push({
          id: Date.now().toString(),
          title,
          completed: false,
        });
      }
    },
    toggleTaskStep: (state, action) => {
      const { taskId, stepId } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        const step = task.steps.find(s => s.id === stepId);
        if (step) {
          step.completed = !step.completed;
        }
      }
    },
    deleteTaskStep: (state, action) => {
      const { taskId, stepId } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.steps = task.steps.filter(s => s.id !== stepId);
      }
    },
    updateTaskDueDate: (state, action) => {
      const { taskId, dueDate } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.dueDate = dueDate;
      }
    },
    updateTaskReminder: (state, action) => {
      const { taskId, reminder } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.reminder = reminder;
      }
    },
    updateTaskRepeat: (state, action) => {
      const { taskId, repeat } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.repeat = repeat;
      }
    },
    updateTaskNotes: (state, action) => {
      const { taskId, notes } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.notes = notes;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTaskWithWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskWithWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        // Update task count for the current list
        if (state.selectedList !== 'all' && state.selectedList !== 'today' && 
            state.selectedList !== 'important' && state.selectedList !== 'planned' && 
            state.selectedList !== 'assigned') {
          const list = state.lists.find(l => l.id === state.selectedList);
          if (list) {
            list.taskCount++;
          }
        }
      })
      .addCase(addTaskWithWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add task';
      });
  },
});

export const { 
  deleteTask, 
  toggleTaskComplete, 
  toggleTaskStar, 
  setTaskReminder,
  setSelectedList,
  addList,
  deleteList,
  addTaskStep,
  toggleTaskStep,
  deleteTaskStep,
  updateTaskDueDate,
  updateTaskReminder,
  updateTaskRepeat,
  updateTaskNotes,
} = tasksSlice.actions;

export default tasksSlice.reducer;