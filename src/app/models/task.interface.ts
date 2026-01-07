export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface CreateTask {
  title: string;
  completed?: boolean;
}

export interface UpdateTask {
  title?: string;
  completed?: boolean;
}
