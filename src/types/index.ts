export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  starred: boolean;
  reminder?: string;
  assignedTo?: string;
  listId?: string;
  steps: TaskStep[];
  notes?: string;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'none';
  weather?: {
    temp: number;
    condition: string;
    icon: string;
  };
}

export interface TaskStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface List {
  id: string;
  name: string;
  createdAt: string;
  taskCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  email: string | null;
}

export interface TasksState {
  tasks: Task[];
  selectedTask: string | null;
  loading: boolean;
  error: string | null;
  selectedList: 'all' | 'today' | 'important' | 'planned' | 'assigned' | string;
  lists: List[];
}